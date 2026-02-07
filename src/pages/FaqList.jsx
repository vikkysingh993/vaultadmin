import { useEffect, useState } from "react";
import api from "../config/axios";
import Swal from "sweetalert2";
import FaqModal from "../components/FaqModal";

export default function FaqList() {
  const token = sessionStorage.getItem("token");

  const [faqs, setFaqs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [form, setForm] = useState({
    question: "",
    answer: "",
    status: "ACTIVE",
  });

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const loadFaqs = async () => {
    const res = await api.get("/admin/faqs", { headers });
    setFaqs(res.data.data);
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  /* OPEN ADD */
  const openAdd = () => {
    setForm({ question: "", answer: "", status: "ACTIVE" });
    setIsEdit(false);
    setShowModal(true);
  };

  /* OPEN EDIT */
  const openEdit = (faq) => {
    setForm(faq);
    setCurrentId(faq.id);
    setIsEdit(true);
    setShowModal(true);
  };

  /* SUBMIT */
  const submit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      await api.put(`/admin/faqs/${currentId}`, form, { headers });
      Swal.fire("Updated", "FAQ updated successfully", "success");
    } else {
      await api.post("/admin/faqs", form, { headers });
      Swal.fire("Added", "FAQ added successfully", "success");
    }

    setShowModal(false);
    loadFaqs();
  };

  /* DELETE */
  const remove = async (id) => {
    const ok = await Swal.fire({
      title: "Delete FAQ?",
      icon: "warning",
      showCancelButton: true,
    });

    if (ok.isConfirmed) {
      await api.delete(`/admin/faqs/${id}`, { headers });
      loadFaqs();
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <h2>FAQs</h2>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add FAQ
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Question</th>
            <th>Status</th>
            <th width="160">Action</th>
          </tr>
        </thead>
        <tbody>
          {faqs.map((faq, i) => (
            <tr key={faq.id}>
              <td>{i + 1}</td>
              <td>{faq.question}</td>
              <td>{faq.status}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => openEdit(faq)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => remove(faq.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <FaqModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={submit}
        form={form}
        setForm={setForm}
        isEdit={isEdit}
      />
    </>
  );
}
