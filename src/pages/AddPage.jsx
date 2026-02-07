import { useEffect, useRef, useState } from "react";
import api from "../config/axios";
import { useNavigate } from "react-router-dom";
import "../assets/css/editor.css";

export default function AddPage() {
  const editorRef = useRef(null);
  const editorInstance = useRef(null);
  const initialized = useRef(false); // 🔒 guard

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (
      window.ClassicEditor &&
      editorRef.current &&
      !initialized.current
    ) {
      initialized.current = true;

      window.ClassicEditor.create(editorRef.current)
        .then((editor) => {
          editorInstance.current = editor;

          editor.model.document.on("change:data", () => {
            setForm((prev) => ({
              ...prev,
              content: editor.getData(),
            }));
          });
        })
        .catch(console.error);
    }

    // 🔥 CLEANUP (important)
    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
        initialized.current = false;
      }
    };
  }, []);
const submit = async (e) => {
  e.preventDefault();

  const token = sessionStorage.getItem("token");

  await api.post(
    "/admin/pages",
    form, // ✅ data
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  navigate("/admin/pages");
};


  return (
    <>
      <h2>Add Page</h2>

      <form onSubmit={submit}>
        <input
          className="form-control mb-3"
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          className="form-control mb-3"
          placeholder="Slug"
          value={form.slug}
          onChange={(e) =>
            setForm({ ...form, slug: e.target.value })
          }
        />

        {/* ✅ SINGLE CKEDITOR */}
        <div className="mb-4">
          <div ref={editorRef}></div>
        </div>

        <button className="btn btn-success">Save</button>
      </form>
    </>
  );
}
