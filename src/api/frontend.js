import service from "@/utils/request";

export function register(data) {
  return service.post('/user/add',data)
}

export function startSession(data) {
  return service.post('/psychological-chat/session/start', data)
}