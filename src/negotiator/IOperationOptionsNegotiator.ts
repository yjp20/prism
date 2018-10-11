interface IOperationOptionsNegotiator<T, K, M, R> {
    negotiate(operationDefinition: T, desiredOptions: K, request: M): Promise<R>;
}