// src/objects/PanObject.ts

/**
 * Abstract base class representing an object within PAN-OS.
 * This class provides common functionality for all PAN-OS objects, such as
 * hierarchical parent-child relationships and XML conversion.
 */
export abstract class PanObject {
  /**
   * The parent object in the PAN-OS object hierarchy, if any.
   * @protected
   */
  protected parent: PanObject | null = null;

  /**
   * The list of children objects in the PAN-OS object hierarchy.
   * @protected
   */
  protected children: PanObject[] = [];

  /**
   * The name of the PAN-OS object.
   */
  public name: string;

  /**
   * Constructs a new `PanObject` with a given name.
   * @param name - The name of the object.
   */
  constructor(name: string) {
    this.name = name;
  }

  /**
   * Adds a child `PanObject` to this object's hierarchy.
   * Sets the current object as the parent of the child.
   *
   * @param child - The child `PanObject` to add.
   */
  public addChild(child: PanObject): void {
    child.parent = this;
    this.children.push(child);
  }

  /**
   * Removes a child `PanObject` from this object's hierarchy.
   * Resets the removed child's parent to null.
   *
   * @param child - The child `PanObject` to remove.
   */
  public removeChild(child: PanObject): void {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
      child.parent = null;
    }
  }

  /**
   * Converts the PAN-OS object into its XML representation.
   * This method must be implemented by all subclasses to provide the specific XML structure required by PAN-OS.
   * @returns The XML string representation of the PAN-OS object.
   */
  public abstract toXml(): string;

  // Other common methods like find(), xpath(), etc., can be added here
}
