import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Forum from './Forum';
import NewPost from './NewPost';
import PostDetail from './PostDetail';

const contentStyle = {
  maxWidth: "600px",
  width: "90%"
};

const Community = () => (
  <div className="Community">

  <main>
    <Switch>
      <Route exact path='/community' component={Forum}/>
      <Route path='/community/newPost' component={NewPost}/>
      <Route path='/community/post' component={PostDetail}/>
    </Switch>
  </main>
  </div>
)

export default Community;
