// src/objects/PanObject.ts

export abstract class PanObject {
  protected parent: PanObject | null = null;
  protected children: PanObject[] = [];

  constructor(public name: string) {}

  // Method to add a child object
  public addChild(child: PanObject): void {
    child.parent = this;
    this.children.push(child);
  }

  // Method to remove a child object
  public removeChild(child: PanObject): void {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
      child.parent = null;
    }
  }

  // Abstract method for generating XML representation of the object
  public abstract toXml(): string;

  // Other common methods like find(), xpath(), etc., can be added here
}
