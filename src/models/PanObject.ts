// src/models/PanObject.ts

/**
 * Abstract base class for objects within the PAN-OS ecosystem. `PanObject` provides common functionalities like
 * managing child objects and maintaining hierarchical relationships, serving as a foundational component for device and configuration representation.
 */
export abstract class PanObject {
  /**
   * The parent of this object within the PAN-OS hierarchy, if it exists.
   *
   * @protected
   */
  protected parent: PanObject | null;

  /**
   * The list of child objects within the PAN-OS hierarchy.
   *
   * @protected
   */
  protected children: PanObject[];

  /**
   * The unique identifier for the PAN-OS object.
   */
  public name: string;

  /**
   * Constructs a new instance of a PanObject with a given name.
   *
   * @param name - The unique name to assign to this PAN-OS object.
   */
  constructor(name: string) {
    this.name = name;
    this.parent = null;
    this.children = [];
  }

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
}
