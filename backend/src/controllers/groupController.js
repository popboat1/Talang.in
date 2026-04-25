import { supabase, supabaseAdmin } from '../config/supabase.js'

// Buat grup baru
export const createGroup = async (req, res) => {
  const { name, description } = req.body
  const userId = req.user.sub

  if (!name) return res.status(400).json({ message: 'Nama grup wajib diisi' })

  const { data: group, error } = await supabaseAdmin
    .from('groups')
    .insert({ name, description, created_by: userId })
    .select()
    .single()

    console.log('GROUP:', group)
  console.log('ERROR:', error)

  if (error) return res.status(400).json({ message: error.message })

  await supabaseAdmin.from('group_members').insert({
    group_id: group.id,
    user_id: userId,
    role: 'admin'
  })

  return res.status(201).json({ message: 'Grup berhasil dibuat', group })
}

// Lihat semua grup user
export const getMyGroups = async (req, res) => {
  const userId = req.user.sub

  const { data, error } = await supabaseAdmin
    .from('group_members')
    .select(`
      role,
      joined_at,
      groups (
        id, name, description, created_at,
        group_members (count)
      )
    `)
    .eq('user_id', userId)

  if (error) return res.status(400).json({ message: error.message })

  return res.status(200).json({ groups: data })
}

// Lihat detail 1 grup
export const getGroupById = async (req, res) => {
  const { id } = req.params
  const userId = req.user.sub

  // Cek apakah user adalah anggota grup
  const { data: member } = await supabaseAdmin
    .from('group_members')
    .select('*')
    .eq('group_id', id)
    .eq('user_id', userId)
    .single()

  if (!member) return res.status(403).json({ message: 'Kamu bukan anggota grup ini' })

  const { data, error } = await supabaseAdmin
    .from('groups')
    .select(`
      *,
      group_members (
        id, role, joined_at,
        profiles (id, full_name, email, avatar_url)
      )
    `)
    .eq('id', id)
    .single()

  if (error) return res.status(404).json({ message: 'Grup tidak ditemukan' })

  return res.status(200).json({ group: data })
}

// Tambah anggota ke grup
export const addMember = async (req, res) => {
  const { id } = req.params
  const { email } = req.body

  // Cari user berdasarkan email di auth.users lewat admin
  const { data: userList, error: userError } = await supabaseAdmin.auth.admin.listUsers()

  if (userError) return res.status(400).json({ message: userError.message })

  const foundUser = userList.users.find(u => u.email === email)

  if (!foundUser) {
    return res.status(404).json({ message: 'User dengan email tersebut tidak ditemukan' })
  }

  // Cek apakah sudah jadi anggota
  const { data: existing } = await supabaseAdmin
    .from('group_members')
    .select('id')
    .eq('group_id', id)
    .eq('user_id', foundUser.id)
    .single()

  if (existing) {
    return res.status(400).json({ message: 'User sudah menjadi anggota grup ini' })
  }

  const { error } = await supabaseAdmin.from('group_members').insert({
    group_id: id,
    user_id: foundUser.id,
    role: 'member'
  })

  if (error) return res.status(400).json({ message: error.message })

  return res.status(201).json({ message: 'Anggota berhasil ditambahkan' })
}

// Hapus anggota dari grup
export const removeMember = async (req, res) => {
  const { id, userId } = req.params
  const requesterId = req.user.sub

  // Cek apakah requester adalah admin
  const { data: requester } = await supabaseAdmin
    .from('group_members')
    .select('role')
    .eq('group_id', id)
    .eq('user_id', requesterId)
    .single()

  if (!requester || requester.role !== 'admin') {
    return res.status(403).json({ message: 'Hanya admin yang bisa menghapus anggota' })
  }

  const { error } = await supabaseAdmin
    .from('group_members')
    .delete()
    .eq('group_id', id)
    .eq('user_id', userId)

  if (error) return res.status(400).json({ message: error.message })

  return res.status(200).json({ message: 'Anggota berhasil dihapus' })
}