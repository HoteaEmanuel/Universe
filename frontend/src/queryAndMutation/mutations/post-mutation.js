import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { usePostStore } from "../../store/postStore";
import { toast } from "sonner";
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  const { createPost } = usePostStore();
  return useMutation({
    mutationFn: (post) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post created");
    },
    onError: (err) => {
      toast.error(err);
    },
  });
};
export const useLikeMutation = (postId) => {
  const queryClient = useQueryClient();
  const { likePost } = usePostStore();
  return useMutation({
    mutationFn: () => likePost({ postId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
      queryClient.invalidateQueries({ queryKey: ["likes", postId] });
    },
  });
};
export const useUnlikeMutation = (postId) => {
  const queryClient = useQueryClient();
  const { unlikePost } = usePostStore();
  return useMutation({
    mutationFn: () => unlikePost({ postId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
      queryClient.invalidateQueries({ queryKey: ["likes", postId] });
    },
  });
};
export const useUpdatePostMutation = ( userId) => {
  const queryClient = useQueryClient();
  const { updatePost } = usePostStore();
  return useMutation({
    mutationFn: async (data) => await updatePost(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["userPosts", userId]);
    },
  });
};
export const useDeletePostMutation = (postId, userId) => {
  const queryClient = useQueryClient();
  const { deletePost } = usePostStore();
  console.log("USER DELETE POST MUTATION " + userId);
  return useMutation({
    mutationFn: async () => await deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["userPosts", userId]);
    },
  });
};
