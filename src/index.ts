// src/index.ts

/**
 * The root module providing foundational and specialized classes to interact
 * with Palo Alto Networks Operating System (PAN-OS) devices. It includes base
 * objects, device-specific classes, and various object types for network configuration.
 */

/**
 * A specialized class derived from `PanDevice` for interactions with Palo Alto Networks
 * firewall devices. It extends the generic device functionalities with methods tailored
 * to firewall resource monitoring and system information management.
 *
 * @exports Firewall
 */
export { Firewall } from './models/Firewall';

/**
 * A class representing network address entities (objects) in the context of Palo Alto Networks
 * Operating System (PAN-OS). It encapsulates the functionality necessary for managing
 * network address configurations and their associations within security policies and other
 * system components.
 *
 * @exports AddressObject
 */
export { AddressObject } from './models/AddressObject';

/**
 * An enumeration of supported network address formats in PAN-OS.
 * Includes IP netmask, IP range, IP wildcard, and Fully Qualified Domain Name (FQDN) types.
 *
 * @exports AddressType
 */
export { AddressType } from './models/AddressObject';
