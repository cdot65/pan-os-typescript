// src/objects/PanObject.ts

/**
 * Represents a base object within the PAN-OS ecosystem.
 * This abstract class provides foundational features common to all PAN-OS objects,
 * such as hierarchical structuring and XML representation.
 */
export abstract class PanObject {
  /**
   * The parent of this object in the PAN-OS hierarchy, if any.
   * @protected
   */
  protected parent: PanObject | null;

  /**
   * A list of child objects within the PAN-OS hierarchy.
   * @protected
   */
  protected children: PanObject[];

  /**
   * The unique name of the PAN-OS object.
   */
  public name: string;

  /**
   * Constructs a new instance of a PanObject.
   * @param name - The unique name assigned to this PAN-OS object.
   */
  constructor(name: string) {
    this.name = name;
    this.parent = null;
    this.children = [];
  }

  /**
   * Adds a child object to this object's hierarchy.
   * The method sets this object as the parent of the provided child.
   *
   * @param child - The child object to be added to the hierarchy.
   */
  public addChild(child: PanObject): void {
    child.parent = this;
    this.children.push(child);
  }

  /**
   * Removes a child object from this object's hierarchy.
   * Upon removal, the child's parent reference is reset to null.
   *
   * @param child - The child object to be removed from the hierarchy.
   */
  public removeChild(child: PanObject): void {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      child.parent = null;
    }
  }

  /**
   * Converts the object into its XML string representation.
   * Implementing classes must override this method to provide the specific XML structure required by PAN-OS.
   *
   * @returns A string representing the XML format of the PAN-OS object.
   * @abstract
   */
  public abstract toXml(): string;

  // Additional methods and properties can be defined here as needed.
}
