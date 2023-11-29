import React, { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../db/db";
import { Trash } from "react-feather";
import { Exercise } from "../types/Exercise";
import { Workout } from "../types/Workout";

const default_exercises: Exercise[] = [];

const ExerciseRow = ({
  exercise,
  onChange,
  onDelete,
}: {
  exercise: Exercise;
  onChange: (exercise: Exercise) => void;
  onDelete: (exercise: Exercise) => void;
}) => {
  return (
    <div className="row mb-4">
      <div className="d-flex align-items-center gap-1 col-12 col-lg-6 mb-2 mb-lg-0">
        <Form.Control
          type="text"
          value={exercise.name}
          onChange={(e) => {
            onChange({ ...exercise, name: e.target.value });
          }}
        />
        <Trash
          color="gray"
          style={{ cursor: "pointer" }}
          onClick={() => {
            onDelete(exercise);
          }}
        />
      </div>
      <div className="col-4 col-lg-2 d-flex gap-1 align-items-center">
        <Form.Control
          type="number"
          value={exercise.weight}
          onChange={(e) => {
            onChange({ ...exercise, weight: parseInt(e.target.value) ?? 0 });
          }}
        />
        <span>lbs</span>
      </div>
      <div className="col-4 col-lg-2 d-flex gap-1 align-items-center">
        <Form.Control
          type="number"
          value={exercise.reps}
          onChange={(e) => {
            onChange({ ...exercise, reps: parseInt(e.target.value) ?? 0 });
          }}
        />
        <span>reps</span>
      </div>
      <div className="col-4 col-lg-2 d-flex gap-1 align-items-center">
        <Form.Control
          type="number"
          value={exercise.sets}
          onChange={(e) => {
            onChange({ ...exercise, sets: parseInt(e.target.value) ?? 0 });
          }}
        />
        <span>sets</span>
      </div>
    </div>
  );
};

export default function WorkoutPage() {
  const [searchParams] = useSearchParams();
  const [workout, setWorkout] = useState<Workout>({
    id: "",
    name: "",
    exercises: default_exercises,
    timestamp: 0
  });

  useEffect(() => {
    (async () => {
      const workoutId = searchParams.get("id");

      if (workoutId) {
        onSnapshot(doc(db, "workouts", workoutId), (doc) => {
          if (doc.exists()) {
            setWorkout({
              id: doc.id,
              ...(doc.data() as any),
            });
          }
        });
      }
    })();
  }, [searchParams]);

  const handleChangeExercise = async (newExercise: Exercise) => {
    let newExercises = workout.exercises.map((ex) =>
      ex.id === newExercise.id ? newExercise : ex
    );

    await updateDoc(doc(db, "workouts", workout.id), {
      exercises: newExercises,
    });
  };

  const handleDeleteExercise = async (deletedExercise: Exercise) => {
    let newExercises = workout.exercises.filter(
      (ex) => ex.id !== deletedExercise.id
    );

    await updateDoc(doc(db, "workouts", workout.id), {
      exercises: newExercises,
    });
  };

  const handleChangeName = async (newName: string) => {
    await updateDoc(doc(db, "workouts", workout.id), {
      name: newName,
    });
  };

  const containerRef: React.LegacyRef<HTMLDivElement> = useRef(null);

  useEffect(() => {
    if (workout.exercises.length) {
      (
        containerRef.current?.children[0]?.children[0]
          ?.children[0] as HTMLElement
      ).focus();
    }
  }, [workout.exercises.length]);

  return (
    <>
      <div
        className="container-md mx-md-10 px-2"
        style={{ maxWidth: "100%", overflowX: "hidden" }}
      >
        <Form className="mx-2 d-flex gap-2">
          <Form.Control
            type="text"
            placeholder="Name"
            value={workout.name ?? ""}
            onChange={(e) => {
              handleChangeName(e.target.value);
            }}
          />
        </Form>
        <hr className="mx-2" />
        <div className="d-flex flex-row-reverse mb-2 mx-2">
          <Button
            variant="secondary"
            onClick={(e) => {
              setWorkout((prev) => ({
                ...prev,
                exercises: [
                  {
                    id: uuid(),
                    name: "",
                    weight: 0,
                    reps: 0,
                    sets: 0,
                  },
                  ...prev.exercises,
                ],
              }));
            }}
          >
            Add Exercise
          </Button>
        </div>
        <div className="container px-0" ref={containerRef}>
          {workout.exercises.map((exercise) => (
            <ExerciseRow
              exercise={exercise}
              onChange={handleChangeExercise}
              onDelete={handleDeleteExercise}
              key={exercise.id}
            />
          ))}
        </div>
      </div>
    </>
  );
}
