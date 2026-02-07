import Swal from "sweetalert2";

export default function FaqModal({
  show,
  onClose,
  onSubmit,
  form,
  setForm,
  isEdit,
}) {
  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ background: "#0006" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">
              {isEdit ? "Edit FAQ" : "Add FAQ"}
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={onSubmit}>
            <div className="modal-body">

              <label className="form-label">Question</label>
              <input
                className="form-control mb-3"
                value={form.question}
                onChange={(e) =>
                  setForm({ ...form, question: e.target.value })
                }
                required
              />

              <label className="form-label">Answer</label>
              <textarea
                className="form-control mb-3"
                rows={5}
                value={form.answer}
                onChange={(e) =>
                  setForm({ ...form, answer: e.target.value })
                }
                required
              />

              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>

            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-success">
                {isEdit ? "Update FAQ" : "Add FAQ"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
