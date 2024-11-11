import React, { useEffect, useRef, useCallback } from 'react';
import { VariableSizeList } from 'react-window';

const Listbox = React.forwardRef((props, ref) => {
  const { children, onListEnd, ...other } = props;
  const itemCount = React.Children.count(children);
  const itemSize = 50;

  const listRef = useRef(null);
  const outerRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (!outerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = outerRef.current;
    
    // Check if there's enough content to scroll
    if (scrollHeight > clientHeight) {
      // Only trigger onListEnd if we're close to the bottom
      if (scrollHeight - scrollTop - clientHeight < 1) {
        console.log("Reached end of list");
        onListEnd();
      }
    }
  }, [onListEnd]);

  useEffect(() => {
    const currentOuterRef = outerRef.current;
    if (currentOuterRef) {
      currentOuterRef.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentOuterRef) {
        currentOuterRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  const outerElementType = React.forwardRef((props, outerRef) => (
    <div ref={outerRef} {...props} {...other} />
  ));

  // Calculate the actual height based on the number of items
  const listHeight = Math.min(itemCount * itemSize, 250);

  return (
    <VariableSizeList
      ref={listRef}
      outerRef={outerRef}
      height={listHeight}
      itemSize={() => itemSize}
      itemCount={itemCount}
      outerElementType={outerElementType}
      innerElementType="ul"
      width="100%"
      onScroll={handleScroll}
    >
      {({ index, style }) => React.cloneElement(children[index], { style })}
    </VariableSizeList>
  );
});

export default Listbox;