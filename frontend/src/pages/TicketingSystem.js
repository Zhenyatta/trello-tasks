import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Modal } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import NotificationModal from '../components/NotificationModal';

const colorObj = {
  missed: '#FF6347',
  complete: '#28A745',
  incomplete: '#FFD700',
  upcoming: '#C8C8C8'
};

const columnNames = ['Missed', 'Today', 'This Week', 'This Month', 'This year', 'Completed'];

const TicketingSystem = ({ notifications, currentCompany }) => {
  const [data, setData] = useState({ columns: {} });
  const [openModal, setOpenModal] = useState(false);
  const [currentNotif, setCurrentNotif] = useState(null);

  // Convert backend data into frontend column format
  useEffect(() => {
    if (notifications) {
      const formattedColumns = {};

      columnNames.forEach((name, i) => {
        const key = `column-${i + 1}`;
        formattedColumns[key] = {
          name,
          items: (notifications[name] || []).map((item) => ({
            id: item.notification_id.toString(),
            notification_name: item.notification_name,
            description: item.description,
            notify_at: new Date(item.notify_at).toLocaleDateString(),
            type: item.type,
            notify_who: item.notify_who,
            repeat_type: item.repeat_type,
            is_completed: item.is_completed,
            video: item.video,
          })),
        };
      });

      setData({ columns: formattedColumns });
    }
  }, [notifications]);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {return;};

    if (source.droppableId === destination.droppableId) {
      const column = data.columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      setData((prev) => ({
        ...prev,
        columns: {
          ...prev.columns,
          [source.droppableId]: {
            ...column,
            items: copiedItems,
          },
        },
      }));
    } else {
      const sourceColumn = data.columns[source.droppableId];
      const destColumn = data.columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setData((prev) => ({
        ...prev,
        columns: {
          ...prev.columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
          },
          [destination.droppableId]: {
            ...destColumn,
            items: destItems,
          },
        },
      }));
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '1rem',
            overflow: 'auto',
            position: 'relative',
            height: '90%',
          }}
        >
          {Object.entries(data.columns).map(([columnId, column]) => (
            <Box
              key={columnId}
              sx={{
                minWidth: '250px',
                maxWidth: '300px',
                background: '#F7F8F9',
                borderRadius: '8px',
                padding: '1rem',
                marginRight: '1rem',
              }}
            >
              <Typography variant='body2' sx={{ marginBottom: '1rem', textAlign: 'center' }}>
                {column.name}
              </Typography>
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    sx={{
                      minHeight: '100px',
                      padding: '1rem',
                      borderRadius: '8px',
                    }}
                  >
                    {column.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              marginBottom: '1rem',
                              background: colorObj[item.type],
                              boxShadow: 'none',
                              borderRadius: '10px',
                            }}
                            onClick={() => {
                              setCurrentNotif(item);
                              setOpenModal(true);
                            }}
                          >
                            <CardContent>
                              <Typography sx={{ color: '#fff' }}>{item.notification_name}</Typography>
                              <Typography sx={{
                                color: '#fff',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}>{item.description}</Typography>
                              <Typography sx={{ color: '#fff' }}>{item.notify_at}</Typography>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          ))}
        </Box>
      </DragDropContext>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby='notification-modal-title'
        aria-describedby='notification-modal-description'
      >
        <NotificationModal
          notification={currentNotif}
          onClose={() => setOpenModal(false)}
          currentCompany={currentCompany}
        />
      </Modal>
    </>
  );
};

export default TicketingSystem;
