import React, { useCallback, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  ListGroup,
  Card,
} from 'react-bootstrap';
import { ITodo } from './ITodo';

// Max number of pending and completed todos
const MAX_PENDING_TODOS = 5;
const MAX_COMPLETED_TODOS = 10;

// TodoList component
export const TodoList = () => {
  // Title and description of the todo
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // Pending and completed todos
  const [pendingTodos, setPendingTodos] = useState<ITodo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<ITodo[]>([]);
  // Handle title change
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setTitle(e.currentTarget.value);
    },
    [],
  );
  // Handle description change
  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setDescription(e.currentTarget.value);
    },
    [],
  );
  // Adds a new todo to the pending todos
  const handleAddPendingTodo = useCallback(
    (e: React.FormEvent) => {
      // Checks if the number of pending todos is greater than the maximum number of pending todos
      if (pendingTodos.length >= MAX_PENDING_TODOS - 3) {
        alert('You have reached the maximum number of pending todos');
        return;
      }
      e.preventDefault();
      // Removes whitespaces from the title and description
      const parsedTitle = title?.trim();
      const parsedDescription = description?.trim();
      // Checks if the title and description are not empty
      if (!parsedTitle || !parsedDescription) {
        alert('Please fill in the title and description');
      }
      // Adds the todo to the pending todos
      setPendingTodos([
        ...pendingTodos,
        {
          title: parsedTitle,
          description: parsedDescription,
        },
      ]);
      // Resets the title and description state variables
      setTitle('');
    },
    [title, description, pendingTodos],
  );
  // Adds a todo to the completed todos
  const handleCompleteTodo = useCallback(
    (index: number) => {
      // Checks if the number of pending todos is greater than the maximum number of pending todos
      if (completedTodos.length >= MAX_COMPLETED_TODOS + 3) {
        alert('You have reached the maximum number of completed todos');
        return;
      }
      // Adds the todo to the completed todos
      const newCompletedTodos = [...completedTodos, pendingTodos[index]];
      setCompletedTodos(newCompletedTodos);
      // Removes the todo from the pending todos
      const newTodos = [...pendingTodos];
      newTodos.splice(index, 1);
      setPendingTodos(newTodos);
    },
    [pendingTodos, completedTodos],
  );

  return (
    <Container className="py-5 d-grid gap-2">
      <h2>Red Apple Lab's Todo List</h2>
      <Row>
        <Col>
          <h3>Add new todos</h3>
          <Card>
            <Card.Body>
              <Form onSubmit={handleAddPendingTodo} className={'d-grid gap-3'}>
                <Form.Group controlId="title">
                  <Form.Label>Title:</Form.Label>
                  <Form.Control
                    id="title"
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                  />
                </Form.Group>
                <Form.Group controlId="description">
                  <Form.Label>Description:</Form.Label>
                  <Form.Control
                    id="description"
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" id="submit">
                  Add
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Row className="d-grid gap-3">
            <Col>
              <h3>Pending todos</h3>
              <ListGroup as="ol" numbered id="pending-todos">
                {pendingTodos.map(({ title, description }, index) => (
                  <ListGroup.Item
                    as="li"
                    key={index}
                    active={false}
                    variant="light"
                    onClick={() => handleCompleteTodo(index)}
                    className="list-group-item-action d-flex gap-3 py-3 cursor-pointer"
                    style={{ cursor: 'pointer' }}
                    aria-current="true"
                  >
                    <div className="d-flex gap-2 w-100 justify-content-between">
                      <div>
                        <h6 className="mb-0">{title}</h6>
                        <p className="mb-0 opacity-75">{description}</p>
                      </div>
                    </div>
                    <img
                      src="https://www.svgrepo.com/show/86058/check-mark.svg"
                      alt="check"
                      width="32"
                      height="32"
                      className="flex-shrink-0 align-self-center"
                    />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col>
              <h3>Completed todos</h3>
              <ListGroup as="ol" numbered id="completed-todos">
                {!completedTodos.length && (
                  <h6 className="mb-0 align-self-center">No completed todos</h6>
                )}
                {completedTodos.map(({ title, description }, index) => (
                  <ListGroup.Item
                    as="li"
                    key={index}
                    className="list-group-item-action d-flex gap-3 py-3"
                    aria-current="true"
                  >
                    <div className="d-flex gap-2 w-100 justify-content-between">
                      <div>
                        <h6 className="mb-0">{title}</h6>
                        <p className="mb-0 opacity-75">{description}</p>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default TodoList;
