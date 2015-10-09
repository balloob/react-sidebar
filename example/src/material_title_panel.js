import React from 'react';
import update from 'react-addons-update';

const styles = {
  root: {
   fontFamily: '"HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
   fontWeight: 300,
  },
  header: {
    backgroundColor: '#03a9f4',
    color: 'white',
    padding: '16px',
    fontSize: '1.5em',
  },
  content: {
    padding: '16px',
  },
};

const MaterialTitlePanel = (props) => {
    let rootStyle =   props.style ?
                      update(styles.root, {$merge: props.style}) :
                      styles.root;

    return (
      <div style={rootStyle}>
        <div style={styles.header}>{props.title}</div>
        <div style={styles.content}>{props.children}</div>
      </div>
    );
  
}

export default MaterialTitlePanel;
