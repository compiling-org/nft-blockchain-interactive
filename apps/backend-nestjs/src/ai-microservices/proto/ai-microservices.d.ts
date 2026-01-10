import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace ai_microservices. */
export namespace ai_microservices {

    /** Represents an AiMicroservicesService */
    class AiMicroservicesService extends $protobuf.rpc.Service {

        /**
         * Constructs a new AiMicroservicesService service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new AiMicroservicesService service using the specified rpc implementation.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         * @returns RPC service. Useful where requests and/or responses are streamed.
         */
        public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): AiMicroservicesService;

        /**
         * Calls ProcessText.
         * @param request ProcessTextRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ProcessTextResponse
         */
        public processText(request: ai_microservices.IProcessTextRequest, callback: ai_microservices.AiMicroservicesService.ProcessTextCallback): void;

        /**
         * Calls ProcessText.
         * @param request ProcessTextRequest message or plain object
         * @returns Promise
         */
        public processText(request: ai_microservices.IProcessTextRequest): Promise<ai_microservices.ProcessTextResponse>;

        /**
         * Calls AnalyzeImage.
         * @param request AnalyzeImageRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and AnalyzeImageResponse
         */
        public analyzeImage(request: ai_microservices.IAnalyzeImageRequest, callback: ai_microservices.AiMicroservicesService.AnalyzeImageCallback): void;

        /**
         * Calls AnalyzeImage.
         * @param request AnalyzeImageRequest message or plain object
         * @returns Promise
         */
        public analyzeImage(request: ai_microservices.IAnalyzeImageRequest): Promise<ai_microservices.AnalyzeImageResponse>;
    }

    namespace AiMicroservicesService {

        /**
         * Callback as used by {@link ai_microservices.AiMicroservicesService#processText}.
         * @param error Error, if any
         * @param [response] ProcessTextResponse
         */
        type ProcessTextCallback = (error: (Error|null), response?: ai_microservices.ProcessTextResponse) => void;

        /**
         * Callback as used by {@link ai_microservices.AiMicroservicesService#analyzeImage}.
         * @param error Error, if any
         * @param [response] AnalyzeImageResponse
         */
        type AnalyzeImageCallback = (error: (Error|null), response?: ai_microservices.AnalyzeImageResponse) => void;
    }

    /** Properties of a ProcessTextRequest. */
    interface IProcessTextRequest {

        /** ProcessTextRequest text */
        text?: (string|null);
    }

    /** Represents a ProcessTextRequest. */
    class ProcessTextRequest implements IProcessTextRequest {

        /**
         * Constructs a new ProcessTextRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: ai_microservices.IProcessTextRequest);

        /** ProcessTextRequest text. */
        public text: string;

        /**
         * Creates a new ProcessTextRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ProcessTextRequest instance
         */
        public static create(properties?: ai_microservices.IProcessTextRequest): ai_microservices.ProcessTextRequest;

        /**
         * Encodes the specified ProcessTextRequest message. Does not implicitly {@link ai_microservices.ProcessTextRequest.verify|verify} messages.
         * @param message ProcessTextRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: ai_microservices.IProcessTextRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ProcessTextRequest message, length delimited. Does not implicitly {@link ai_microservices.ProcessTextRequest.verify|verify} messages.
         * @param message ProcessTextRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: ai_microservices.IProcessTextRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ProcessTextRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ProcessTextRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ai_microservices.ProcessTextRequest;

        /**
         * Decodes a ProcessTextRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ProcessTextRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ai_microservices.ProcessTextRequest;

        /**
         * Verifies a ProcessTextRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ProcessTextRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ProcessTextRequest
         */
        public static fromObject(object: { [k: string]: any }): ai_microservices.ProcessTextRequest;

        /**
         * Creates a plain object from a ProcessTextRequest message. Also converts values to other types if specified.
         * @param message ProcessTextRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: ai_microservices.ProcessTextRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ProcessTextRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ProcessTextRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ProcessTextResponse. */
    interface IProcessTextResponse {

        /** ProcessTextResponse processedText */
        processedText?: (string|null);

        /** ProcessTextResponse keywords */
        keywords?: (string[]|null);
    }

    /** Represents a ProcessTextResponse. */
    class ProcessTextResponse implements IProcessTextResponse {

        /**
         * Constructs a new ProcessTextResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: ai_microservices.IProcessTextResponse);

        /** ProcessTextResponse processedText. */
        public processedText: string;

        /** ProcessTextResponse keywords. */
        public keywords: string[];

        /**
         * Creates a new ProcessTextResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ProcessTextResponse instance
         */
        public static create(properties?: ai_microservices.IProcessTextResponse): ai_microservices.ProcessTextResponse;

        /**
         * Encodes the specified ProcessTextResponse message. Does not implicitly {@link ai_microservices.ProcessTextResponse.verify|verify} messages.
         * @param message ProcessTextResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: ai_microservices.IProcessTextResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ProcessTextResponse message, length delimited. Does not implicitly {@link ai_microservices.ProcessTextResponse.verify|verify} messages.
         * @param message ProcessTextResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: ai_microservices.IProcessTextResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ProcessTextResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ProcessTextResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ai_microservices.ProcessTextResponse;

        /**
         * Decodes a ProcessTextResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ProcessTextResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ai_microservices.ProcessTextResponse;

        /**
         * Verifies a ProcessTextResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ProcessTextResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ProcessTextResponse
         */
        public static fromObject(object: { [k: string]: any }): ai_microservices.ProcessTextResponse;

        /**
         * Creates a plain object from a ProcessTextResponse message. Also converts values to other types if specified.
         * @param message ProcessTextResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: ai_microservices.ProcessTextResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ProcessTextResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ProcessTextResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AnalyzeImageRequest. */
    interface IAnalyzeImageRequest {

        /** AnalyzeImageRequest imageData */
        imageData?: (Uint8Array|null);

        /** AnalyzeImageRequest imageFormat */
        imageFormat?: (string|null);
    }

    /** Represents an AnalyzeImageRequest. */
    class AnalyzeImageRequest implements IAnalyzeImageRequest {

        /**
         * Constructs a new AnalyzeImageRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: ai_microservices.IAnalyzeImageRequest);

        /** AnalyzeImageRequest imageData. */
        public imageData: Uint8Array;

        /** AnalyzeImageRequest imageFormat. */
        public imageFormat: string;

        /**
         * Creates a new AnalyzeImageRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AnalyzeImageRequest instance
         */
        public static create(properties?: ai_microservices.IAnalyzeImageRequest): ai_microservices.AnalyzeImageRequest;

        /**
         * Encodes the specified AnalyzeImageRequest message. Does not implicitly {@link ai_microservices.AnalyzeImageRequest.verify|verify} messages.
         * @param message AnalyzeImageRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: ai_microservices.IAnalyzeImageRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AnalyzeImageRequest message, length delimited. Does not implicitly {@link ai_microservices.AnalyzeImageRequest.verify|verify} messages.
         * @param message AnalyzeImageRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: ai_microservices.IAnalyzeImageRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AnalyzeImageRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AnalyzeImageRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ai_microservices.AnalyzeImageRequest;

        /**
         * Decodes an AnalyzeImageRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AnalyzeImageRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ai_microservices.AnalyzeImageRequest;

        /**
         * Verifies an AnalyzeImageRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AnalyzeImageRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AnalyzeImageRequest
         */
        public static fromObject(object: { [k: string]: any }): ai_microservices.AnalyzeImageRequest;

        /**
         * Creates a plain object from an AnalyzeImageRequest message. Also converts values to other types if specified.
         * @param message AnalyzeImageRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: ai_microservices.AnalyzeImageRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AnalyzeImageRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AnalyzeImageRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AnalyzeImageResponse. */
    interface IAnalyzeImageResponse {

        /** AnalyzeImageResponse analysisResult */
        analysisResult?: (string|null);

        /** AnalyzeImageResponse detectedObjects */
        detectedObjects?: (string[]|null);
    }

    /** Represents an AnalyzeImageResponse. */
    class AnalyzeImageResponse implements IAnalyzeImageResponse {

        /**
         * Constructs a new AnalyzeImageResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: ai_microservices.IAnalyzeImageResponse);

        /** AnalyzeImageResponse analysisResult. */
        public analysisResult: string;

        /** AnalyzeImageResponse detectedObjects. */
        public detectedObjects: string[];

        /**
         * Creates a new AnalyzeImageResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AnalyzeImageResponse instance
         */
        public static create(properties?: ai_microservices.IAnalyzeImageResponse): ai_microservices.AnalyzeImageResponse;

        /**
         * Encodes the specified AnalyzeImageResponse message. Does not implicitly {@link ai_microservices.AnalyzeImageResponse.verify|verify} messages.
         * @param message AnalyzeImageResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: ai_microservices.IAnalyzeImageResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AnalyzeImageResponse message, length delimited. Does not implicitly {@link ai_microservices.AnalyzeImageResponse.verify|verify} messages.
         * @param message AnalyzeImageResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: ai_microservices.IAnalyzeImageResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AnalyzeImageResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AnalyzeImageResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ai_microservices.AnalyzeImageResponse;

        /**
         * Decodes an AnalyzeImageResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AnalyzeImageResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ai_microservices.AnalyzeImageResponse;

        /**
         * Verifies an AnalyzeImageResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AnalyzeImageResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AnalyzeImageResponse
         */
        public static fromObject(object: { [k: string]: any }): ai_microservices.AnalyzeImageResponse;

        /**
         * Creates a plain object from an AnalyzeImageResponse message. Also converts values to other types if specified.
         * @param message AnalyzeImageResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: ai_microservices.AnalyzeImageResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AnalyzeImageResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AnalyzeImageResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
