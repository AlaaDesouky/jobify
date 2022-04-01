const FormRow = ({ type, name, value, labelText, handleChage }) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className='form-label'>{labelText || name}</label>

      <input className="form-input" type={type} name={name} value={value} onChange={handleChage} />
    </div>
  )
}

export default FormRow
