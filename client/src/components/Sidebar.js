import React from 'react';
import { Button } from 'reactstrap';

function Sidebar() {
  return (
    <div>
      <h2>Quick Actions</h2>
      <div className="center-buttons">
        <Button className="button-padding" color="primary" block>
          New Post
        </Button>
        <Button className="button-padding" color="info" block>
          Manage Posts
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
