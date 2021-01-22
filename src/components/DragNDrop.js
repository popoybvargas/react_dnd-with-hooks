import { useRef, useState } from "react";

function DragNDrop({ data })
{
  const [list, setList] = useState(data);
  const [dragging, setDragging] = useState(false);

  const dragItem = useRef();
  const dragNode = useRef();

  const handleDragStart = (e, params) =>
  {
    console.log('drag starting...', params);
    dragItem.current = params;
    dragNode.current = e.target;
    dragNode.current.addEventListener('dragend', handleDragEnd)
    setTimeout(() =>
    {
      setDragging(true);
    }, 0);
  };

  const handleDragEnter = (e, params) =>
  {
    console.log('entering drag...', params);
    const currentItem = dragItem.current;

    if (e.target !== dragNode.current)
    {
      console.log('TARGET IS NOT THE SAME');
      setList(oldList =>
      {
        let newList = JSON.parse(JSON.stringify(oldList));
        newList[params.grpI].items.splice(params.itemI, 0, newList[currentItem.grpI].items.splice(currentItem.itemI, 1)[0]);
        dragItem.current = params;

        return newList;
      });
    }
  };

  const handleDragEnd = () =>
  {
    console.log('ending drag...');
    setDragging(false);
    dragNode.current.removeEventListener('dragend', handleDragEnd);
    dragItem.current = null;
    dragNode.current = null;
  };

  const getStyles = (params) =>
  {
    const currentItem = dragItem.current;

    if (currentItem.grpI === params.grpI && currentItem.itemI === params.itemI)
    {
      return 'current dnd-item';
    }

    return 'dnd-item';
  };

  // useEffect(() =>
  // {
  //   setList(data);
  // }, [ setList, data ]);

  return (
    <div className="drag-n-drop">
      {
        list.map((grp, grpI) => (
          <div
            key={ grp.title }
            className="dnd-group"
            onDragEnter={ dragging && !grp.items.length ? e => handleDragEnter(e, {grpI, itemI: 0 }) : null }
            onDragOver={ e => e.preventDefault() }>
            <div className="group-title">{ grp.title }</div>
            {
              grp.items.map((item, itemI) => (
                <div
                  draggable
                  onDragStart={ e => handleDragStart(e, {grpI, itemI }) }
                  onDragEnter={ dragging ? e => handleDragEnter(e, { grpI, itemI }) : null }
                  onDragOver={ e => e.preventDefault() }
                  key={ item }
                  className={ dragging ? getStyles({ grpI, itemI }) : "dnd-item" }>
                  { item }
                </div>
              ))
            }
          </div>
        ))
      }
    </div>
  );
}

export default DragNDrop;