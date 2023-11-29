import { useEffect, useState } from "react";
import { Button, Card, } from "react-bootstrap";
import { Workout } from "../types/Workout";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../db/db";
import { useNavigate } from "react-router-dom";

export default function Root() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const fetchWorkouts = async () => {
    let querySnapshot = await getDocs(
      query(collection(db, "workouts"), orderBy("timestamp", "desc"))
    );
    if (!querySnapshot.empty) {
      setWorkouts(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }))
      );
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <div className="mx-2 mx-md-10 px-2">
        <h1 className="text-center">Workout Tracker</h1>
        <div className="d-flex flex-row-reverse">
          <Button
            variant="primary"
            className="mb-2"
            onClick={async (e) => {
              let result = await addDoc(collection(db, "workouts"), {
                name: new Date().toLocaleString([], {
                  day: "numeric",
                  month: "numeric",
                  year: "2-digit",
                }),
                timestamp: Date.now() / 1000,
                exercises: [],
              });

              navigate(`/workout?id=${result.id}`)
            }}
          >
            New Workout
          </Button>
        </div>
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          {workouts.map((workout) => (
            <Card
            className="flex-shrink-0"
              style={{ width: "18rem", cursor: "pointer" }}
              onClick={(e) => {
                navigate(`/workout?id=${workout.id}`);
              }}
            >
              <Card.Body>
                <Card.Title>{workout.name}</Card.Title>
                <Card.Text>
                  {new Date(workout.timestamp * 1000).toLocaleString([], {
                    day: "numeric",
                    month: "numeric",
                    year: "2-digit",
                    hour: "numeric",
                    minute: "2-digit",
                  })}{" "}
                  - {`${workout.exercises.length} exercises`}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
