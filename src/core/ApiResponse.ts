// /* eslint-disable import/prefer-default-export */
// /* eslint-disable max-classes-per-file */
// import { Response } from 'express';

// // eslint-disable-next-line no-shadow
// enum ResponseStatus {
//     SUCCESS = 200,
//     BAD_REQUEST = 400,
//     UNAUTHORIZED = 401,
//     FORBIDDEN = 403,
//     NOT_FOUND = 404,
//     INTERNAL_ERROR = 500,
// }

// abstract class ApiResponse {
//     private readonly status: ResponseStatus;

//     constructor(status: ResponseStatus, message: string) {
//         this.status = status;
//     }

//     protected prepare<T extends ApiResponse>(res: Response, response: T): Response {
//         return res.status(this.status).json(ApiResponse.sanitize(response));
//     }

//     public send(res: Response): Response {
//         return this.prepare<ApiResponse>(res, this);
//     }

//     private static sanitize<T extends ApiResponse>(response: T): T {
//         const clone: T = {} as T;
//         Object.assign(clone, response);
//         Object.keys(clone).forEach((key) => (clone[key] === undefined ? delete clone[key] : {}));
//         return clone;
//     }
// }

// export class SuccessResponse<T> extends ApiResponse {
//     constructor(message: string, private data: T) {
//         super(ResponseStatus.SUCCESS, message);
//     }

//     send(res: Response): Response {
//         return super.prepare<SuccessResponse<T>>(res, this);
//     }
// }
