/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.ai_microservices = (function() {

    /**
     * Namespace ai_microservices.
     * @exports ai_microservices
     * @namespace
     */
    var ai_microservices = {};

    ai_microservices.AiMicroservicesService = (function() {

        /**
         * Constructs a new AiMicroservicesService service.
         * @memberof ai_microservices
         * @classdesc Represents an AiMicroservicesService
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function AiMicroservicesService(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (AiMicroservicesService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = AiMicroservicesService;

        /**
         * Creates new AiMicroservicesService service using the specified rpc implementation.
         * @function create
         * @memberof ai_microservices.AiMicroservicesService
         * @static
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {AiMicroservicesService} RPC service. Useful where requests and/or responses are streamed.
         */
        AiMicroservicesService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };

        /**
         * Callback as used by {@link ai_microservices.AiMicroservicesService#processText}.
         * @memberof ai_microservices.AiMicroservicesService
         * @typedef ProcessTextCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {ai_microservices.ProcessTextResponse} [response] ProcessTextResponse
         */

        /**
         * Calls ProcessText.
         * @function processText
         * @memberof ai_microservices.AiMicroservicesService
         * @instance
         * @param {ai_microservices.IProcessTextRequest} request ProcessTextRequest message or plain object
         * @param {ai_microservices.AiMicroservicesService.ProcessTextCallback} callback Node-style callback called with the error, if any, and ProcessTextResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(AiMicroservicesService.prototype.processText = function processText(request, callback) {
            return this.rpcCall(processText, $root.ai_microservices.ProcessTextRequest, $root.ai_microservices.ProcessTextResponse, request, callback);
        }, "name", { value: "ProcessText" });

        /**
         * Calls ProcessText.
         * @function processText
         * @memberof ai_microservices.AiMicroservicesService
         * @instance
         * @param {ai_microservices.IProcessTextRequest} request ProcessTextRequest message or plain object
         * @returns {Promise<ai_microservices.ProcessTextResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link ai_microservices.AiMicroservicesService#analyzeImage}.
         * @memberof ai_microservices.AiMicroservicesService
         * @typedef AnalyzeImageCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {ai_microservices.AnalyzeImageResponse} [response] AnalyzeImageResponse
         */

        /**
         * Calls AnalyzeImage.
         * @function analyzeImage
         * @memberof ai_microservices.AiMicroservicesService
         * @instance
         * @param {ai_microservices.IAnalyzeImageRequest} request AnalyzeImageRequest message or plain object
         * @param {ai_microservices.AiMicroservicesService.AnalyzeImageCallback} callback Node-style callback called with the error, if any, and AnalyzeImageResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(AiMicroservicesService.prototype.analyzeImage = function analyzeImage(request, callback) {
            return this.rpcCall(analyzeImage, $root.ai_microservices.AnalyzeImageRequest, $root.ai_microservices.AnalyzeImageResponse, request, callback);
        }, "name", { value: "AnalyzeImage" });

        /**
         * Calls AnalyzeImage.
         * @function analyzeImage
         * @memberof ai_microservices.AiMicroservicesService
         * @instance
         * @param {ai_microservices.IAnalyzeImageRequest} request AnalyzeImageRequest message or plain object
         * @returns {Promise<ai_microservices.AnalyzeImageResponse>} Promise
         * @variation 2
         */

        return AiMicroservicesService;
    })();

    ai_microservices.ProcessTextRequest = (function() {

        /**
         * Properties of a ProcessTextRequest.
         * @memberof ai_microservices
         * @interface IProcessTextRequest
         * @property {string|null} [text] ProcessTextRequest text
         */

        /**
         * Constructs a new ProcessTextRequest.
         * @memberof ai_microservices
         * @classdesc Represents a ProcessTextRequest.
         * @implements IProcessTextRequest
         * @constructor
         * @param {ai_microservices.IProcessTextRequest=} [properties] Properties to set
         */
        function ProcessTextRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ProcessTextRequest text.
         * @member {string} text
         * @memberof ai_microservices.ProcessTextRequest
         * @instance
         */
        ProcessTextRequest.prototype.text = "";

        /**
         * Creates a new ProcessTextRequest instance using the specified properties.
         * @function create
         * @memberof ai_microservices.ProcessTextRequest
         * @static
         * @param {ai_microservices.IProcessTextRequest=} [properties] Properties to set
         * @returns {ai_microservices.ProcessTextRequest} ProcessTextRequest instance
         */
        ProcessTextRequest.create = function create(properties) {
            return new ProcessTextRequest(properties);
        };

        /**
         * Encodes the specified ProcessTextRequest message. Does not implicitly {@link ai_microservices.ProcessTextRequest.verify|verify} messages.
         * @function encode
         * @memberof ai_microservices.ProcessTextRequest
         * @static
         * @param {ai_microservices.IProcessTextRequest} message ProcessTextRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProcessTextRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.text != null && Object.hasOwnProperty.call(message, "text"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.text);
            return writer;
        };

        /**
         * Encodes the specified ProcessTextRequest message, length delimited. Does not implicitly {@link ai_microservices.ProcessTextRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof ai_microservices.ProcessTextRequest
         * @static
         * @param {ai_microservices.IProcessTextRequest} message ProcessTextRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProcessTextRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ProcessTextRequest message from the specified reader or buffer.
         * @function decode
         * @memberof ai_microservices.ProcessTextRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {ai_microservices.ProcessTextRequest} ProcessTextRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProcessTextRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ai_microservices.ProcessTextRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.text = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ProcessTextRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof ai_microservices.ProcessTextRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {ai_microservices.ProcessTextRequest} ProcessTextRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProcessTextRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ProcessTextRequest message.
         * @function verify
         * @memberof ai_microservices.ProcessTextRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ProcessTextRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.text != null && message.hasOwnProperty("text"))
                if (!$util.isString(message.text))
                    return "text: string expected";
            return null;
        };

        /**
         * Creates a ProcessTextRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof ai_microservices.ProcessTextRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {ai_microservices.ProcessTextRequest} ProcessTextRequest
         */
        ProcessTextRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.ai_microservices.ProcessTextRequest)
                return object;
            var message = new $root.ai_microservices.ProcessTextRequest();
            if (object.text != null)
                message.text = String(object.text);
            return message;
        };

        /**
         * Creates a plain object from a ProcessTextRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof ai_microservices.ProcessTextRequest
         * @static
         * @param {ai_microservices.ProcessTextRequest} message ProcessTextRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ProcessTextRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.text = "";
            if (message.text != null && message.hasOwnProperty("text"))
                object.text = message.text;
            return object;
        };

        /**
         * Converts this ProcessTextRequest to JSON.
         * @function toJSON
         * @memberof ai_microservices.ProcessTextRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ProcessTextRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ProcessTextRequest
         * @function getTypeUrl
         * @memberof ai_microservices.ProcessTextRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ProcessTextRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/ai_microservices.ProcessTextRequest";
        };

        return ProcessTextRequest;
    })();

    ai_microservices.ProcessTextResponse = (function() {

        /**
         * Properties of a ProcessTextResponse.
         * @memberof ai_microservices
         * @interface IProcessTextResponse
         * @property {string|null} [processedText] ProcessTextResponse processedText
         * @property {Array.<string>|null} [keywords] ProcessTextResponse keywords
         */

        /**
         * Constructs a new ProcessTextResponse.
         * @memberof ai_microservices
         * @classdesc Represents a ProcessTextResponse.
         * @implements IProcessTextResponse
         * @constructor
         * @param {ai_microservices.IProcessTextResponse=} [properties] Properties to set
         */
        function ProcessTextResponse(properties) {
            this.keywords = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ProcessTextResponse processedText.
         * @member {string} processedText
         * @memberof ai_microservices.ProcessTextResponse
         * @instance
         */
        ProcessTextResponse.prototype.processedText = "";

        /**
         * ProcessTextResponse keywords.
         * @member {Array.<string>} keywords
         * @memberof ai_microservices.ProcessTextResponse
         * @instance
         */
        ProcessTextResponse.prototype.keywords = $util.emptyArray;

        /**
         * Creates a new ProcessTextResponse instance using the specified properties.
         * @function create
         * @memberof ai_microservices.ProcessTextResponse
         * @static
         * @param {ai_microservices.IProcessTextResponse=} [properties] Properties to set
         * @returns {ai_microservices.ProcessTextResponse} ProcessTextResponse instance
         */
        ProcessTextResponse.create = function create(properties) {
            return new ProcessTextResponse(properties);
        };

        /**
         * Encodes the specified ProcessTextResponse message. Does not implicitly {@link ai_microservices.ProcessTextResponse.verify|verify} messages.
         * @function encode
         * @memberof ai_microservices.ProcessTextResponse
         * @static
         * @param {ai_microservices.IProcessTextResponse} message ProcessTextResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProcessTextResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.processedText != null && Object.hasOwnProperty.call(message, "processedText"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.processedText);
            if (message.keywords != null && message.keywords.length)
                for (var i = 0; i < message.keywords.length; ++i)
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.keywords[i]);
            return writer;
        };

        /**
         * Encodes the specified ProcessTextResponse message, length delimited. Does not implicitly {@link ai_microservices.ProcessTextResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof ai_microservices.ProcessTextResponse
         * @static
         * @param {ai_microservices.IProcessTextResponse} message ProcessTextResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProcessTextResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ProcessTextResponse message from the specified reader or buffer.
         * @function decode
         * @memberof ai_microservices.ProcessTextResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {ai_microservices.ProcessTextResponse} ProcessTextResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProcessTextResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ai_microservices.ProcessTextResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.processedText = reader.string();
                        break;
                    }
                case 2: {
                        if (!(message.keywords && message.keywords.length))
                            message.keywords = [];
                        message.keywords.push(reader.string());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ProcessTextResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof ai_microservices.ProcessTextResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {ai_microservices.ProcessTextResponse} ProcessTextResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProcessTextResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ProcessTextResponse message.
         * @function verify
         * @memberof ai_microservices.ProcessTextResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ProcessTextResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.processedText != null && message.hasOwnProperty("processedText"))
                if (!$util.isString(message.processedText))
                    return "processedText: string expected";
            if (message.keywords != null && message.hasOwnProperty("keywords")) {
                if (!Array.isArray(message.keywords))
                    return "keywords: array expected";
                for (var i = 0; i < message.keywords.length; ++i)
                    if (!$util.isString(message.keywords[i]))
                        return "keywords: string[] expected";
            }
            return null;
        };

        /**
         * Creates a ProcessTextResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof ai_microservices.ProcessTextResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {ai_microservices.ProcessTextResponse} ProcessTextResponse
         */
        ProcessTextResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.ai_microservices.ProcessTextResponse)
                return object;
            var message = new $root.ai_microservices.ProcessTextResponse();
            if (object.processedText != null)
                message.processedText = String(object.processedText);
            if (object.keywords) {
                if (!Array.isArray(object.keywords))
                    throw TypeError(".ai_microservices.ProcessTextResponse.keywords: array expected");
                message.keywords = [];
                for (var i = 0; i < object.keywords.length; ++i)
                    message.keywords[i] = String(object.keywords[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a ProcessTextResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof ai_microservices.ProcessTextResponse
         * @static
         * @param {ai_microservices.ProcessTextResponse} message ProcessTextResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ProcessTextResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.keywords = [];
            if (options.defaults)
                object.processedText = "";
            if (message.processedText != null && message.hasOwnProperty("processedText"))
                object.processedText = message.processedText;
            if (message.keywords && message.keywords.length) {
                object.keywords = [];
                for (var j = 0; j < message.keywords.length; ++j)
                    object.keywords[j] = message.keywords[j];
            }
            return object;
        };

        /**
         * Converts this ProcessTextResponse to JSON.
         * @function toJSON
         * @memberof ai_microservices.ProcessTextResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ProcessTextResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ProcessTextResponse
         * @function getTypeUrl
         * @memberof ai_microservices.ProcessTextResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ProcessTextResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/ai_microservices.ProcessTextResponse";
        };

        return ProcessTextResponse;
    })();

    ai_microservices.AnalyzeImageRequest = (function() {

        /**
         * Properties of an AnalyzeImageRequest.
         * @memberof ai_microservices
         * @interface IAnalyzeImageRequest
         * @property {Uint8Array|null} [imageData] AnalyzeImageRequest imageData
         * @property {string|null} [imageFormat] AnalyzeImageRequest imageFormat
         */

        /**
         * Constructs a new AnalyzeImageRequest.
         * @memberof ai_microservices
         * @classdesc Represents an AnalyzeImageRequest.
         * @implements IAnalyzeImageRequest
         * @constructor
         * @param {ai_microservices.IAnalyzeImageRequest=} [properties] Properties to set
         */
        function AnalyzeImageRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AnalyzeImageRequest imageData.
         * @member {Uint8Array} imageData
         * @memberof ai_microservices.AnalyzeImageRequest
         * @instance
         */
        AnalyzeImageRequest.prototype.imageData = $util.newBuffer([]);

        /**
         * AnalyzeImageRequest imageFormat.
         * @member {string} imageFormat
         * @memberof ai_microservices.AnalyzeImageRequest
         * @instance
         */
        AnalyzeImageRequest.prototype.imageFormat = "";

        /**
         * Creates a new AnalyzeImageRequest instance using the specified properties.
         * @function create
         * @memberof ai_microservices.AnalyzeImageRequest
         * @static
         * @param {ai_microservices.IAnalyzeImageRequest=} [properties] Properties to set
         * @returns {ai_microservices.AnalyzeImageRequest} AnalyzeImageRequest instance
         */
        AnalyzeImageRequest.create = function create(properties) {
            return new AnalyzeImageRequest(properties);
        };

        /**
         * Encodes the specified AnalyzeImageRequest message. Does not implicitly {@link ai_microservices.AnalyzeImageRequest.verify|verify} messages.
         * @function encode
         * @memberof ai_microservices.AnalyzeImageRequest
         * @static
         * @param {ai_microservices.IAnalyzeImageRequest} message AnalyzeImageRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AnalyzeImageRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.imageData != null && Object.hasOwnProperty.call(message, "imageData"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.imageData);
            if (message.imageFormat != null && Object.hasOwnProperty.call(message, "imageFormat"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.imageFormat);
            return writer;
        };

        /**
         * Encodes the specified AnalyzeImageRequest message, length delimited. Does not implicitly {@link ai_microservices.AnalyzeImageRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof ai_microservices.AnalyzeImageRequest
         * @static
         * @param {ai_microservices.IAnalyzeImageRequest} message AnalyzeImageRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AnalyzeImageRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AnalyzeImageRequest message from the specified reader or buffer.
         * @function decode
         * @memberof ai_microservices.AnalyzeImageRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {ai_microservices.AnalyzeImageRequest} AnalyzeImageRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AnalyzeImageRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ai_microservices.AnalyzeImageRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.imageData = reader.bytes();
                        break;
                    }
                case 2: {
                        message.imageFormat = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AnalyzeImageRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof ai_microservices.AnalyzeImageRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {ai_microservices.AnalyzeImageRequest} AnalyzeImageRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AnalyzeImageRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AnalyzeImageRequest message.
         * @function verify
         * @memberof ai_microservices.AnalyzeImageRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AnalyzeImageRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.imageData != null && message.hasOwnProperty("imageData"))
                if (!(message.imageData && typeof message.imageData.length === "number" || $util.isString(message.imageData)))
                    return "imageData: buffer expected";
            if (message.imageFormat != null && message.hasOwnProperty("imageFormat"))
                if (!$util.isString(message.imageFormat))
                    return "imageFormat: string expected";
            return null;
        };

        /**
         * Creates an AnalyzeImageRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof ai_microservices.AnalyzeImageRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {ai_microservices.AnalyzeImageRequest} AnalyzeImageRequest
         */
        AnalyzeImageRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.ai_microservices.AnalyzeImageRequest)
                return object;
            var message = new $root.ai_microservices.AnalyzeImageRequest();
            if (object.imageData != null)
                if (typeof object.imageData === "string")
                    $util.base64.decode(object.imageData, message.imageData = $util.newBuffer($util.base64.length(object.imageData)), 0);
                else if (object.imageData.length >= 0)
                    message.imageData = object.imageData;
            if (object.imageFormat != null)
                message.imageFormat = String(object.imageFormat);
            return message;
        };

        /**
         * Creates a plain object from an AnalyzeImageRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof ai_microservices.AnalyzeImageRequest
         * @static
         * @param {ai_microservices.AnalyzeImageRequest} message AnalyzeImageRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AnalyzeImageRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.imageData = "";
                else {
                    object.imageData = [];
                    if (options.bytes !== Array)
                        object.imageData = $util.newBuffer(object.imageData);
                }
                object.imageFormat = "";
            }
            if (message.imageData != null && message.hasOwnProperty("imageData"))
                object.imageData = options.bytes === String ? $util.base64.encode(message.imageData, 0, message.imageData.length) : options.bytes === Array ? Array.prototype.slice.call(message.imageData) : message.imageData;
            if (message.imageFormat != null && message.hasOwnProperty("imageFormat"))
                object.imageFormat = message.imageFormat;
            return object;
        };

        /**
         * Converts this AnalyzeImageRequest to JSON.
         * @function toJSON
         * @memberof ai_microservices.AnalyzeImageRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AnalyzeImageRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for AnalyzeImageRequest
         * @function getTypeUrl
         * @memberof ai_microservices.AnalyzeImageRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        AnalyzeImageRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/ai_microservices.AnalyzeImageRequest";
        };

        return AnalyzeImageRequest;
    })();

    ai_microservices.AnalyzeImageResponse = (function() {

        /**
         * Properties of an AnalyzeImageResponse.
         * @memberof ai_microservices
         * @interface IAnalyzeImageResponse
         * @property {string|null} [analysisResult] AnalyzeImageResponse analysisResult
         * @property {Array.<string>|null} [detectedObjects] AnalyzeImageResponse detectedObjects
         */

        /**
         * Constructs a new AnalyzeImageResponse.
         * @memberof ai_microservices
         * @classdesc Represents an AnalyzeImageResponse.
         * @implements IAnalyzeImageResponse
         * @constructor
         * @param {ai_microservices.IAnalyzeImageResponse=} [properties] Properties to set
         */
        function AnalyzeImageResponse(properties) {
            this.detectedObjects = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AnalyzeImageResponse analysisResult.
         * @member {string} analysisResult
         * @memberof ai_microservices.AnalyzeImageResponse
         * @instance
         */
        AnalyzeImageResponse.prototype.analysisResult = "";

        /**
         * AnalyzeImageResponse detectedObjects.
         * @member {Array.<string>} detectedObjects
         * @memberof ai_microservices.AnalyzeImageResponse
         * @instance
         */
        AnalyzeImageResponse.prototype.detectedObjects = $util.emptyArray;

        /**
         * Creates a new AnalyzeImageResponse instance using the specified properties.
         * @function create
         * @memberof ai_microservices.AnalyzeImageResponse
         * @static
         * @param {ai_microservices.IAnalyzeImageResponse=} [properties] Properties to set
         * @returns {ai_microservices.AnalyzeImageResponse} AnalyzeImageResponse instance
         */
        AnalyzeImageResponse.create = function create(properties) {
            return new AnalyzeImageResponse(properties);
        };

        /**
         * Encodes the specified AnalyzeImageResponse message. Does not implicitly {@link ai_microservices.AnalyzeImageResponse.verify|verify} messages.
         * @function encode
         * @memberof ai_microservices.AnalyzeImageResponse
         * @static
         * @param {ai_microservices.IAnalyzeImageResponse} message AnalyzeImageResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AnalyzeImageResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.analysisResult != null && Object.hasOwnProperty.call(message, "analysisResult"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.analysisResult);
            if (message.detectedObjects != null && message.detectedObjects.length)
                for (var i = 0; i < message.detectedObjects.length; ++i)
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.detectedObjects[i]);
            return writer;
        };

        /**
         * Encodes the specified AnalyzeImageResponse message, length delimited. Does not implicitly {@link ai_microservices.AnalyzeImageResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof ai_microservices.AnalyzeImageResponse
         * @static
         * @param {ai_microservices.IAnalyzeImageResponse} message AnalyzeImageResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AnalyzeImageResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AnalyzeImageResponse message from the specified reader or buffer.
         * @function decode
         * @memberof ai_microservices.AnalyzeImageResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {ai_microservices.AnalyzeImageResponse} AnalyzeImageResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AnalyzeImageResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ai_microservices.AnalyzeImageResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.analysisResult = reader.string();
                        break;
                    }
                case 2: {
                        if (!(message.detectedObjects && message.detectedObjects.length))
                            message.detectedObjects = [];
                        message.detectedObjects.push(reader.string());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AnalyzeImageResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof ai_microservices.AnalyzeImageResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {ai_microservices.AnalyzeImageResponse} AnalyzeImageResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AnalyzeImageResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AnalyzeImageResponse message.
         * @function verify
         * @memberof ai_microservices.AnalyzeImageResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AnalyzeImageResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.analysisResult != null && message.hasOwnProperty("analysisResult"))
                if (!$util.isString(message.analysisResult))
                    return "analysisResult: string expected";
            if (message.detectedObjects != null && message.hasOwnProperty("detectedObjects")) {
                if (!Array.isArray(message.detectedObjects))
                    return "detectedObjects: array expected";
                for (var i = 0; i < message.detectedObjects.length; ++i)
                    if (!$util.isString(message.detectedObjects[i]))
                        return "detectedObjects: string[] expected";
            }
            return null;
        };

        /**
         * Creates an AnalyzeImageResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof ai_microservices.AnalyzeImageResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {ai_microservices.AnalyzeImageResponse} AnalyzeImageResponse
         */
        AnalyzeImageResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.ai_microservices.AnalyzeImageResponse)
                return object;
            var message = new $root.ai_microservices.AnalyzeImageResponse();
            if (object.analysisResult != null)
                message.analysisResult = String(object.analysisResult);
            if (object.detectedObjects) {
                if (!Array.isArray(object.detectedObjects))
                    throw TypeError(".ai_microservices.AnalyzeImageResponse.detectedObjects: array expected");
                message.detectedObjects = [];
                for (var i = 0; i < object.detectedObjects.length; ++i)
                    message.detectedObjects[i] = String(object.detectedObjects[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from an AnalyzeImageResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof ai_microservices.AnalyzeImageResponse
         * @static
         * @param {ai_microservices.AnalyzeImageResponse} message AnalyzeImageResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AnalyzeImageResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.detectedObjects = [];
            if (options.defaults)
                object.analysisResult = "";
            if (message.analysisResult != null && message.hasOwnProperty("analysisResult"))
                object.analysisResult = message.analysisResult;
            if (message.detectedObjects && message.detectedObjects.length) {
                object.detectedObjects = [];
                for (var j = 0; j < message.detectedObjects.length; ++j)
                    object.detectedObjects[j] = message.detectedObjects[j];
            }
            return object;
        };

        /**
         * Converts this AnalyzeImageResponse to JSON.
         * @function toJSON
         * @memberof ai_microservices.AnalyzeImageResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AnalyzeImageResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for AnalyzeImageResponse
         * @function getTypeUrl
         * @memberof ai_microservices.AnalyzeImageResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        AnalyzeImageResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/ai_microservices.AnalyzeImageResponse";
        };

        return AnalyzeImageResponse;
    })();

    return ai_microservices;
})();

module.exports = $root;
