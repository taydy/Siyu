/**
 * AUTH.
 */
export const LOGIN_ENDPOINT = '/api/auth/login'
export const REGISTER_ENDPOINT = '/api/auth/register'

/**
 * USER.
 */
export const GET_USERINFO = '/api/auth/users'
export const PUT_USERINFO = '/api/auth/users/{id}'
export const UPDATE_PASSWORD_USERINFO = '/api/auth/users/{id}/password'

/**
 * ARTCILE.
 */
export const GET_COMMON_ARTICLE = '/api/common/blog/blogs'
export const SEARCH_COMMON_ARTICLE = '/api/common/blog/blogs/search'
export const GET_COMMON_LABEL = '/api/common/blog/blogs/labels'
export const GET_COMMON_CATEGORY = '/api/common/blog/blogs/categories'
export const GET_COMMON_ARTICLE_BY_ID = 'api/common/blog/blogs/'
export const GET_AUTH_ARTICLE = '/api/auth/blogs'
export const GET_AUTH_ARTICLE_BY_PID = '/api/auth/blogs/{pid}'
export const GET_AUTH_ARTICLE_CATEGORY = '/api/auth/blogs/category'
export const POST_AUTH_ARTICLE_CATEGORY = '/api/auth/blogs/category'
export const PUT_AUTH_ARTICLE_CATEGORY = '/api/auth/blogs/category/{id}'
export const DELETE_AUTH_ARTICLE_CATEGORY = '/api/auth/blogs/category/{id}'
export const FACET_AUTH_ARTICLE_CATEGORY = '/api/auth/blogs/category/facet'
export const POST_AUTH_ADD_ARTICLE = '/api/auth/blogs'
export const PUT_AUTH_UPDATE_ARTICLE = '/api/auth/blogs/{pid}'
export const DELETE_AUTH_ARTYICLE = '/api/auth/blogs/{pid}'

export const UPLOAD_PICTURE = '/api/auth/users/picture'
