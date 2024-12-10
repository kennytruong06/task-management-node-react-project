import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
} from '@coreui/react'

const CreateTask = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  })

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    dueDate: '',
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title || formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters long.'
    }
    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long.'
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Please select a due date.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await fetch('http://localhost:3002/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          dueDate: formData.dueDate,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        alert('Task created successfully!')
        console.log('Response from server:', result)
        // Reset form
        setFormData({ title: '', description: '', dueDate: '' })
        setErrors({})
      } else {
        const error = await response.json()
        alert('Failed to create task. ' + (error.message || 'Unknown error.'))
        console.error('Error response:', error)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('An error occurred while creating the task.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Create Task Form</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel htmlFor="title">Title</CFormLabel>
                <CFormInput
                  type="text"
                  id="title"
                  placeholder="Enter the title"
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && <div className="text-danger">{errors.title}</div>}
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="description">Description</CFormLabel>
                <CFormTextarea
                  id="description"
                  rows={3}
                  placeholder="Enter the description"
                  value={formData.description}
                  onChange={handleChange}
                />
                {errors.description && <div className="text-danger">{errors.description}</div>}
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="dueDate">Due Date and Time</CFormLabel>
                <CFormInput
                  type="datetime-local"
                  id="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
                {errors.dueDate && <div className="text-danger">{errors.dueDate}</div>}
              </div>
              <CButton type="submit" color="primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CreateTask
