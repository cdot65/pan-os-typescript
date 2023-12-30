// src/models/PanObject.ts

import { ApiClient } from '../services/ApiClient';

/**
 * An abstract class representing a PAN-OS configuration object.
 * This class provides the structure and common functionality for derived configuration objects
 * such as address objects, service objects, and security policies.
 */
export abstract class PanObject {
  protected parent: PanObject | null;
  protected children: PanObject[];
  public name: string;
  protected _apiClient: ApiClient | null;

  /**
   * Constructs a new PanObject with a given name and, optionally, an ApiClient instance.
   * @param name - The name of the object.
   * @param apiClient - An optional ApiClient for making API requests (will be inherited if not provided).
   */
  constructor(name: string, apiClient?: ApiClient) {
    this.name = name;
    this.parent = null;
    this.children = [];
    this._apiClient = apiClient || null;
  }

  /**
   * Retrieves the ApiClient instance from the object or its hierarchy.
   * @returns The ApiClient instance associated with this object.
   * @throws An error if the ApiClient instance is not set.
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
   * Adds a child PanObject to the current object, setting the current object as the parent.
   * @param child - The PanObject instance to be added as a child.
   */
  public addChild(child: PanObject): void {
    child.parent = this;
    this.children.push(child);
  }

  /**
   * Removes a child PanObject from the current object's children and clears its parent reference.
   * @param child - The PanObject instance to be removed from the children list.
   */
  public removeChild(child: PanObject): void {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      child.parent = null;
    }
  }

  /**
   * Provides read-only access to the child PanObjects of the current object.
   * @returns An array of PanObject instances that are children of this object.
   */
  public getChildren(): ReadonlyArray<PanObject> {
    return this.children;
  }

  /**
   * Finds a child PanObject within the current object's children by name.
   * @param name - The name of the child object to find.
   * @returns The found PanObject instance or null if no child is found with the given name.
   */
  public findChildByName(name: string): PanObject | null {
    return this.children.find((child) => child.name === name) || null;
  }

  /**
   * Checks whether the given PanObject is a child of the current object.
   * @param child - The PanObject instance to check for in the children list.
   * @returns True if the object is a child, false otherwise.
   */
  public hasChild(child: PanObject): boolean {
    return this.children.includes(child);
  }

  /**
   * Finds a child PanObject within the configuration tree by name and optionally by type.
   * @param name - The name of the child object to find.
   * @param classType - The constructor of the class type to match.
   * @returns The found PanObject instance or null if no child is found with the given name and type.
   */
  public find<ObjectType extends PanObject>(
    name: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    classType?: new (...args: any[]) => ObjectType,
  ): ObjectType | null {
    for (const child of this.children) {
      if (child.name === name && (!classType || child instanceof classType)) {
        return child as ObjectType;
      }
    }
    return null;
  }
}
