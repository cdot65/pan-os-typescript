/**
 * The root module providing foundational and specialized classes to interact
 * with Palo Alto Networks Operating System (PAN-OS) devices. It includes base
 * objects, device-specific classes, and various object types for network configuration.
 */

/**
 * Firewall class derived from `PanDevice` for interactions with Palo Alto Networks
 * firewall devices. Extends generic device functionalities with methods tailored
 * to firewall resource monitoring and system information management.
 * @module Firewall
 */
export { Firewall } from './models/Firewall';

/**
 * Class representing network address entities (objects) in the context of Palo Alto Networks
 * Operating System (PAN-OS). Encapsulates functionality for managing
 * network address configurations and their associations within security policies and other
 * system components.
 * @module AddressObject
 */
export { AddressObject } from './models/AddressObject';

/**
 * Enumeration of supported network address formats in PAN-OS.
 * Includes IP netmask, IP range, IP wildcard, and Fully Qualified Domain Name (FQDN) types.
 * @module AddressType
 */
export { AddressType } from './models/AddressObject';

/**
 * Service class for generating API keys for Palo Alto Networks devices.
 * Handles API key generation using provided credentials.
 * @module ApiKeyGenerator
 */
export { ApiKeyGenerator } from './services/ApiKeyGenerator';
