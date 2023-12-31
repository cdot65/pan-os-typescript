// src/models/PanObject.ts

import { ApiClient } from '../services/ApiClient';

/**
 * Abstract base class representing a configuration object in PAN-OS.
 * Serves as the foundational structure for derived configuration objects such as address objects, service objects, and security policies.
 */
export abstract class PanObject {
  protected parent: PanObject | null;
  protected children: PanObject[];
  public name: string;
  protected _apiClient: ApiClient | null;

  /**
   * Creates a new instance of `PanObject`.
   *
   * @param name The name of this configuration object.
   * @param apiClient Optional. An `ApiClient` instance for API requests. Inherited from the hierarchy if not provided.
   */
  constructor(name: string, apiClient?: ApiClient) {
    this.name = name;
    this.parent = null;
    this.children = [];
    this._apiClient = apiClient || null;
  }

  /**
   * Retrieves the `ApiClient` from the current instance or its parent hierarchy.
   *
   * @returns The `ApiClient` associated with this object.
   * @throws An error if the `ApiClient` instance is not found in the hierarchy.
   */
  public get apiClient(): ApiClient {
    if (this._apiClient) {
      return this._apiClient;
    }
    if (this.parent) {
      return this.parent.apiClient;
    }
    throw new Error('ApiClient is not set in the object hierarchy.');
  }

  /**
   * Adds a `PanObject` as a child to this object, establishing a parent-child relationship.
   *
   * @param child The `PanObject` to be added as a child.
   */
  public addChild(child: PanObject): void {
    child.parent = this;
    this.children.push(child);
  }

  /**
   * Removes a `PanObject` from this object's children, severing the parent-child relationship.
   *
   * @param child The `PanObject` to be removed from the children.
   */
  public removeChild(child: PanObject): void {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      child.parent = null;
    }
  }

  /**
   * Retrieves the child `PanObject` instances of this object.
   *
   * @returns An array of `PanObject` representing the children of this object.
   */
  public getChildren(): ReadonlyArray<PanObject> {
    return this.children;
  }

  /**
   * Searches for a child `PanObject` by its name.
   *
   * @param name The name of the child object to locate.
   * @returns The found `PanObject`, or `null` if no match is found.
   */
  public findChildByName(name: string): PanObject | null {
    return this.children.find((child) => child.name === name) || null;
  }

  /**
   * Checks if a given `PanObject` is a child of this object.
   *
   * @param child The `PanObject` to verify.
   * @returns `true` if the specified `PanObject` is a child of this object, otherwise `false`.
   */
  public hasChild(child: PanObject): boolean {
    return this.children.includes(child);
  }

  /**
   * Locates a child `PanObject` within the configuration tree by name and, optionally, by type.
   *
   * @param name The name of the object to search for.
   * @param classType Optional. The class constructor to match instances against.
   * @returns The matching `PanObject` instance, or `null` if not found.
   */
  public find<ObjectType extends PanObject>(
    name: string,
    classType?: new (...args: unknown[]) => ObjectType,
  ): ObjectType | null {
    for (const child of this.children) {
      if (child.name === name && (!classType || child instanceof classType)) {
        return child as ObjectType;
      }
    }
    return null;
  }
}
