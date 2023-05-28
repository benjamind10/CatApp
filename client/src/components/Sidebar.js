import React, { useContext } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function Sidebar() {
  const { user, logout } = useContext(UserContext);

  return (
    <div>
      <h2>Quick Actions</h2>
      {user && (
        <Button className="button-padding" color="primary" block>
          <Link
            to="/dashboard"
            style={{ textDecoration: 'none', color: 'white' }}
          >
            Dashboard
          </Link>
        </Button>
      )}
      {/* <Button className="button-padding" color="info" block>
        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
          All Blog Posts
        </Link>
      </Button> */}
    </div>
  );
}

export default Sidebar;
