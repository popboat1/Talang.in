import api from './api'

export const getMyGroups = async () => {
    const { data } = await api.get('/groups')
    return data.groups.map(g => ({
      id: g.groups.id,
      name: g.groups.name,
      description: g.groups.description,
      role: g.role,
      memberCount: g.groups.group_members?.[0]?.count || 0
    }))
}

export const getGroupById = async (id) => {
  const { data } = await api.get(`/groups/${id}`)
  return data.group
}

export const createGroup = async (name, description) => {
  const { data } = await api.post('/groups', { name, description })
  return data.group
}

export const addMember = async (groupId, email) => {
  const { data } = await api.post(`/groups/${groupId}/members`, { email })
  return data
}

export const removeMember = async (groupId, userId) => {
  const { data } = await api.delete(`/groups/${groupId}/members/${userId}`)
  return data
}
