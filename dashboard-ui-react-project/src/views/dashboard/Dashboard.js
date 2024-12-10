import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const Dashboard = () => {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchTasks = async (currentPage, currentStatus) => {
    try {
      setLoading(true)
      const response = await fetch(
        `http://localhost:3002/tasks?page=${currentPage}&limit=10&status=${currentStatus}`,
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()

      return data.data
    } catch (error) {
      console.error('Error loading tasks:', error)
      return []
    } finally {
      setLoading(false)
    }
  }

  const loadMoreTasks = async () => {
    const newPage = page + 1
    const newTasks = await fetchTasks(newPage, status)

    if (newTasks.length > 0) {
      setTasks((prevTasks) => [...prevTasks, ...newTasks])
      setPage(newPage)
    } else {
      setHasMore(false)
    }
  }

  const fetchTasksByStatus = async (newStatus) => {
    setStatus(newStatus)
    setPage(1)
    setHasMore(true)
    const refreshedTasks = await fetchTasks(1, newStatus)
    setTasks(refreshedTasks)
  }

  const handleStatusChange = (event) => {
    const selectedStatus = event.target.value
    fetchTasksByStatus(selectedStatus)
  }

  useEffect(() => {
    fetchTasksByStatus(status)
  }, [])

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return
    }
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3002/tasks/${taskId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId))
      alert('Task deleted successfully!')
    } catch (error) {
      console.error('Error deleting task:', error)
      alert('Failed to delete the task. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleted = async (taskId) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3002/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isCompleted: true }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? { ...task, isCompleted: true } : task)),
      )
      alert('Task marked as completed!')
    } catch (error) {
      console.error('Error completing task:', error)
      alert('Failed to mark the task as completed. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = () => {
    navigate('/create-task') // Chuyển hướng đến trang tạo task
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardBody>
              <CRow className="d-flex justify-content-end">
                <CCol>
                  <CFormSelect
                    aria-label="Select task status"
                    value={status}
                    onChange={handleStatusChange}
                  >
                    <option value="">Default</option>
                    <option value="incomplete">Incomplete</option>
                    <option value="completed">Completed</option>
                  </CFormSelect>
                </CCol>
                <CCol xs="auto">
                  <CButton color="primary" onClick={handleAddTask}>
                    Add
                  </CButton>
                </CCol>
              </CRow>

              <br />

              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-left">#ID</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Name</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Description</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Due Date</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-left">
                      Status
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Activity</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tasks.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-left">
                        <div>{item._id}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.title}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-left">
                        <div>{item.description}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="text-left">
                          <small className="text-body-secondary">
                            {new Date(item.dueDate).toLocaleString('en-GB')}
                          </small>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-left">
                        {item.isCompleted ? (
                          <span className="badge bg-success">Completed</span>
                        ) : (
                          <span className="badge bg-danger">Incomplete</span>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex text-white gap-2 justify-content-start">
                          <CButton
                            color="danger"
                            className="text-white"
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </CButton>
                          <CButton
                            color="success"
                            className="text-white"
                            onClick={() => handleCompleted(item._id)}
                          >
                            Completed
                          </CButton>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              <div className="d-flex justify-content-center mt-4">
                <CButton color="primary" onClick={loadMoreTasks} disabled={loading}>
                  {loading ? 'Loading...' : 'Load More'}
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
