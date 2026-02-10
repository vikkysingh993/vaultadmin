import { useEffect, useRef, useState } from "react";
import api from "../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import "../assets/css/editor.css";

export default function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const editorRef = useRef(null);
  const editorInstance = useRef(null);
  const initialized = useRef(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
  });

  /* ======================
     LOAD PAGE DATA
  ====================== */
  useEffect(() => {
  api.get(`/admin/pages/${id}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  })
  .then((res) => {
    setForm({
      title: res.data.title || "",
      slug: res.data.slug || "",
      content: res.data.content || "",
    });
  })
  .catch(err => {
    console.error("Failed to load page:", err);
  });
}, [id]);


  /* ======================
     INIT CKEDITOR
  ====================== */
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

          // 👇 existing content set
          editor.setData(form.content || "");

          editor.model.document.on("change:data", () => {
            setForm((prev) => ({
              ...prev,
              content: editor.getData(),
            }));
          });
        })
        .catch(console.error);
    }

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
        initialized.current = false;
      }
    };
  }, [form.content]);

  /* ======================
     UPDATE PAGE
  ====================== */
  const submit = async (e) => {
    e.preventDefault();

    await api.put(`/admin/pages/${id}`, form, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
    navigate("/pages");
  };

  return (
    <>
      <h2>Edit Page</h2>

      <form onSubmit={submit}>
        {/* TITLE */}
        <input
          className="form-control mb-3"
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        {/* SLUG */}
        <input
          className="form-control mb-3"
          placeholder="Slug"
          value={form.slug}
          onChange={(e) =>
            setForm({ ...form, slug: e.target.value })
          }
        />

        {/* CKEDITOR */}
        <div className="mb-4">
          <div ref={editorRef}></div>
        </div>

        <button className="btn btn-success">Update</button>
      </form>
    </>
  );
}
