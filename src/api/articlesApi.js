import axios from 'axios'
import commonUtil from '@/assets/js/common'
import {
  GET_COMMON_ARTICLE,
  SEARCH_COMMON_ARTICLE,
  GET_COMMON_LABEL,
  GET_COMMON_CATEGORY,
  GET_COMMON_ARTICLE_BY_ID,
  GET_AUTH_ARTICLE,
  GET_AUTH_ARTICLE_BY_PID,
  GET_AUTH_ARTICLE_CATEGORY,
  POST_AUTH_ADD_ARTICLE,
  PUT_AUTH_UPDATE_ARTICLE,
  DELETE_AUTH_ARTYICLE,
  POST_AUTH_ARTICLE_CATEGORY,
  PUT_AUTH_ARTICLE_CATEGORY,
  DELETE_AUTH_ARTICLE_CATEGORY,
  UPLOAD_PICTURE,
  FACET_AUTH_ARTICLE_CATEGORY
} from './endpoint'

/**
 * 博客文章。
 */
const ArticleApi = {
  /**
   * get common articles.
   */
  getCommonArticles(label, page) {
    label = label || '*'
    page = page || '0'
    return axios.get(GET_COMMON_ARTICLE, {
      params: {
        type: label,
        page: page
      }
    })
  },
  /**
   * search common article.
   */
  searchCommonArticle(search, page) {
    return axios.get(SEARCH_COMMON_ARTICLE, {
      params: {
        search: search,
        page: page
      }
    })
  },
  /**
   * facet common label.
   */
  getCommonLabel() {
    return axios.get(GET_COMMON_LABEL)
  },
  /**
   * facet common category.
   */
  facetCommonCategory() {
    return axios.get(GET_COMMON_CATEGORY)
  },
  /**
   * get article by id.
   */
  getArticleById(id) {
    return axios.get(GET_COMMON_ARTICLE_BY_ID + id)
  },
  /**
   * get auth article.
   */
  getAuthArticles({
    query = '*',
    category = '*',
    label = '*',
    status = 1,
    isPublic = -1,
    page = 1,
    limit = 10
  }) {
    return axios.get(GET_AUTH_ARTICLE, {
      params: {
        query: query,
        category: category,
        label: label,
        status: status,
        isPublic: isPublic,
        page: page,
        limit: limit
      }
    })
  },
  /**
   * ADD auth article.
   */
  addAuthArticle(article) {
    return axios.post(POST_AUTH_ADD_ARTICLE, article)
  },
  /**
   * update auth article.
   */
  updateAuthArticle(article, pid) {
    return axios.put(commonUtil.expandUrl(PUT_AUTH_UPDATE_ARTICLE, {
      pid: pid
    }), article)
  },
  /**
   * delete auth article.
   */
  deleteArticle(pid) {
    return axios.delete(commonUtil.expandUrl(DELETE_AUTH_ARTYICLE, {
      pid: pid
    }))
  },
  /**
   * get auth article by pid.
   */
  getAuthArticlesByPid(pid) {
    return axios.get(commonUtil.expandUrl(GET_AUTH_ARTICLE_BY_PID, {
      pid: pid
    }))
  },
  /**
   * get auth article category.
   */
  getAuthArticleCategory(page, limit) {
    return axios.get(GET_AUTH_ARTICLE_CATEGORY, {
      params: {
        page: page,
        limit: limit
      }
    })
  },
  /**
   * facet category.
   */
  facetAuthCategory() {
    return axios.get(FACET_AUTH_ARTICLE_CATEGORY)
  },
  /**
   * ADD AUTH CATEGORY.
   */
  addAuthArticleCategory(category) {
    return axios.post(POST_AUTH_ARTICLE_CATEGORY, category)
  },
  /**
   * put auth category.
   */
  updateAuthArticleCategory(id, category) {
    return axios.put(commonUtil.expandUrl(PUT_AUTH_ARTICLE_CATEGORY, {
      id: id
    }), category)
  },
  /**
   * delete auth category.
   */
  deleteAuthArticleCategory(id) {
    return axios.delete(commonUtil.expandUrl(DELETE_AUTH_ARTICLE_CATEGORY, {
      id: id
    }))
  },
  /**
   * upload picture.
   */
  uploadPicture(file) {
    var formdata = new FormData()
    formdata.append('file', file)
    return axios({
      url: UPLOAD_PICTURE,
      method: 'post',
      data: formdata,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default ArticleApi
