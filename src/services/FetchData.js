import { authService } from "./Authservice";
import ideaStore from "../store/store";

const fetchIdeaData = async (_id) => {
  const existingIdea = ideaStore.getState().idea;
  if (existingIdea && existingIdea.id === _id) {
    return existingIdea;
  }

  const { idea, error } = await authService.fetchIdea(_id);

  if (error) {
    console.error("Fetch idea error:", error);
    return null;
  }
  if (idea) {
    ideaStore.getState().add(idea);
    return idea;
  }
};

const fetchIdeaArr = async (id) => {
  const { ideas, error } = await authService.fetchIdeaArray(id);

  if (error) {
    console.error("Fetch idea array error:", error);
    return [];
  }

  return ideas || [];
};

export { fetchIdeaData, fetchIdeaArr };
