import { Controller, INestApplication, applyDecorators } from '@nestjs/common';
import {
	ApiOperation,
	ApiResponse,
	ApiBody,
	ApiHeader,
	ApiParam,
	ApiQuery,
	ApiResponseOptions,
	ApiOperationOptions,
	ApiBodyOptions,
	ApiHeaderOptions,
	ApiParamOptions,
	ApiQueryOptions,
	ApiTags,
	ApiBearerAuth,
	DocumentBuilder,
	SwaggerModule,
	OpenAPIObject,
} from '@nestjs/swagger';

type SwaggerOptions = {
	authName?: string;
	operation: ApiOperationOptions;
	responses: ApiResponseOptions[];
	body?: ApiBodyOptions;
	headers?: ApiHeaderOptions[];
	params?: ApiParamOptions[];
	queries?: ApiQueryOptions[];
};

export const OPEN_API_AUTH_NAME = 'access-token';

export function SwaggerRoute({
	authName,
	operation,
	responses,
	body,
	headers,
	params,
	queries,
}: SwaggerOptions) {
	return applyDecorators(
		...([
			ApiOperation(operation),
			...Object.entries(responses).map(([, response]) =>
				ApiResponse({ ...response }),
			),
			authName && ApiBearerAuth(authName),
			body && ApiBody(body),
			...(queries || []).map(ApiQuery),
			...(headers || []).map(ApiHeader),
			...(params || []).map(ApiParam),
		].filter(Boolean) as MethodDecorator[]),
	);
}

export function SwaggerController(prefix: string) {
	return applyDecorators(Controller(prefix), ApiTags(prefix));
}

export function setupSwaggerDocs(app: INestApplication): OpenAPIObject {
	const docBuilder = new DocumentBuilder()
		.setTitle('Geolocation API')
		.setVersion('1.0.0')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				in: 'header',
			},
			OPEN_API_AUTH_NAME,
		);

	return SwaggerModule.createDocument(app, docBuilder.build());
}
