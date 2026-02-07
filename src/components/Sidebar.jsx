import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav">

        <li className="nav-item">
          <Link className="nav-link" to="/">
            <i className="bi bi-grid"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/users">
            <i className="bi bi-people"></i>
            <span>Users</span>
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/tokens"><i className="bi bi-coin"></i><span>Launched Tokens</span></Link>
        </li>
        <li>
          <Link className="nav-link" to="/plans"><i className="bi bi-graph-up"></i><span>Stake Plans</span></Link>
        </li>
        <li>
          <Link className="nav-link" to="/pages"><i className="bi bi-file-earmark"></i><span>Static Pages</span></Link>
        </li>
        <li>
          <Link className="nav-link" to="/faqs"><i className="bi bi-question-circle"></i><span>FAQs</span></Link>
        </li>



      </ul>
    </aside>
  );
}
