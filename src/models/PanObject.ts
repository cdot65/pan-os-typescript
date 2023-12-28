// src/models/PanObject.ts

import { ApiClient } from '../services/ApiClient';

export abstract class PanObject {
  protected parent: PanObject | null;
  protected children: PanObject[];
  public name: string;
  protected _apiClient: ApiClient | null;

  constructor(name: string, apiClient?: ApiClient) {
    this.name = name;
    this.parent = null;
    this.children = [];
    this._apiClient = apiClient || null;
  }

  public get apiClient(): ApiClient {
    if (this._apiClient) {
      return this._apiClient;
    }
    if (this.parent) {
      return this.parent.apiClient;
    }
    throw new Error('ApiClient is not set in the object hierarchy.');
  }

  public abstract getXpath(): string;
  public abstract toXml(): string; // Abstract method toXml

  /**
   * Adds a child object to this object's hierarchy, setting this object as the parent.
   *
   * @param child - The PanObject instance to add as a child.
   */
  public addChild(child: PanObject): void {
    child.parent = this;
    this.children.push(child);
  }

  /**
   * Removes a child object from this object's hierarchy, clearing its parent reference.
   *
   * @param child - The PanObject instance to remove from the children list.
   */
  public removeChild(child: PanObject): void {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      child.parent = null;
    }
  }

  /**
   * Provides read-only access to the child objects of this PanObject.
   *
   * @returns An array of child PanObject instances.
   */
  public getChildren(): ReadonlyArray<PanObject> {
    return this.children;
  }

  /**
   * Finds a child object by its name.
   *
   * @param name - The name of the child object to find.
   * @returns The found PanObject instance or null if not found.
   */
  public findChildByName(name: string): PanObject | null {
    return this.children.find((child) => child.name === name) || null;
  }

  /**
   * Checks if a child object exists in this object's hierarchy.
   *
   * @param child - The PanObject instance to check.
   * @returns True if the child exists, false otherwise.
   */
  public hasChild(child: PanObject): boolean {
    return this.children.includes(child);
  }

  public async create(): Promise<void> {
    const xpath = this.getXpath();
    const element = this.toXml();
    await this.apiClient.setConfig(xpath, element);

    // Optionally, mark the configuration as changed
  }
}
