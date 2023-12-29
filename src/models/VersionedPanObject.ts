// src/models/VersionedPanObject.ts
import { PanObject } from './PanObject';

/**
 * An abstract class that extends `PanObject` to provide version-specific
 * features for PAN-OS objects. Subclasses must implement the `toXml` method
 * that converts the object state to its corresponding XML representation
 * for compatibility with PAN-OS API requests.
 */
export abstract class VersionedPanObject extends PanObject {
  /**
   * Abstract method that converts the object into its corresponding XML representation.
   * This representation is used when interacting with the PAN-OS API.
   * Implementing classes should provide the specific XML conversion logic
   * that matches their version-specific PAN-OS requirements.
   * @abstract
   * @returns The XML string representation of the versioned object.
   */
  public abstract toXml(): string;
}
