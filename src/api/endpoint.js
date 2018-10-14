/**
 * AUTH.
 */
export const LOGIN_ENDPOINT = '/api/auth/login'
export const REGISTER_ENDPOINT = '/api/auth/register'

/**
 * cliend
 */
export const POST_AUTH_CLIENT_REGISTER = '/api/auth/client/register'
export const PUT_AUTH_CLIENT_RENEW = '/api/auth/client/renew'
export const DELETE_AUTH_CLIENT_CANCEL = '/api/auth/client/cancel'

/**
 * USER.
 */
export const GET_USERINFO = '/api/auth/users'
export const PUT_USERINFO = '/api/auth/users/{id}'
export const UPDATE_PASSWORD_USERINFO = '/api/auth/users/{id}/password'
export const USERS_SEARCH = '/api/auth/users/search'

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

/**
 * chat.
 */
export const GET_AUTH_GROUP_FRIENDS = '/api/auth/chat/groups/friends'
export const GET_AUTH_GROUPS = '/api/auth/chat/groups'
export const POST_AUTH_GROUP = '/api/auth/chat/groups'
export const PUT_AUTH_GROUP = '/api/auth/chat/groups/{group_id}'
export const PUT_AUTH_FRIEND = '/api/auth/chat/friends/{friend_number}'
export const DELETE_AUTH_FRIEND = '/api/auth/chat/friends/{friend_number}'
export const POST_AUTH_FRIEND_REQUEST = '/api/auth/chat/friend-request/'
export const GET_AUTH_FRIEND_REQUEST_MY = '/api/auth/chat/friend-request/my'
export const GET_AUTH_FRIEND_REQUEST_OTHER = '/api/auth/chat/friend-request/other'
export const PUT_AUTH_ACCEPT_FRIEND_REQUEST = '/api/auth/chat/friend-request/{id}/accept'
export const PUT_AUTH_REJECT_FRIEND_REQUEST = '/api/auth/chat/friend-request/{id}/reject'
