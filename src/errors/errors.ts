export const errors = {
    emailInUse: {
        statusCode: 400,
        message: 'Email already in use !!!',
        error: 'Bad Request',
        code: 'BAD_REQUEST'
    },
    
    wrongCredentials: {
        statusCode: 400,
        message: 'Wrong credentials',
        error: 'Bad Request',
        code: 'BAD_REQUEST'
    },
    invalidToken: {
        statusCode: 403,
        message: 'Not Authorzied',
        error: 'Invalid Token',
        code: 'INVALID_TOKEN'
    },
    notFound: {
        statusCode: 404,
        message: 'Resource not found',
        error: 'Not Found',
        code: 'NOT_FOUND'
    },
}