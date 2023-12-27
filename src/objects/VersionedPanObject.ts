// src/objects/VersionedPanObject.ts
import { PanObject } from './PanObject';

/**
 * Converts the object into its XML string representation.
 * Implementing classes must override this method to provide the specific XML structure required by PAN-OS.
 *
 * @returns A string representing the XML format of the PAN-OS object.
 * @abstract
 */
export abstract class VersionedPanObject extends PanObject {
  // Define the abstract toXml method
  public abstract toXml(): string;
}
