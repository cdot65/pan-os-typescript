// src/models/VersionedPanObject.ts
import { PanObject } from './PanObject';

/**
 * Abstract base class for version-specific objects in PAN-OS. `VersionedPanObject` extends `PanObject`,
 * requiring derived classes to implement the `toXml` method for XML representation, supporting PAN-OS API interactions.
 */
export abstract class VersionedPanObject extends PanObject {
  /**
   * Converts the object to its XML string representation that can be used in PAN-OS API requests.
   *
   * @returns The XML format of the object as a string.
   */
  public abstract toXml(): string;
}
