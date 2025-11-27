import supabase from "./AuthClient.js";

export const authService = {
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  },
  async register(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  },

  async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { error: "No user found" };
    }

    return { user };
  },

  async getUser(_id) {
    const { data: user, error } = await supabase
      .from("viably_users")
      .select("username, profession, id")
      .eq("user_id", _id)
      .maybeSingle();

    if (error) {
      return { user: null, error };
    }

    return { user, error: null };
  },

  async setUser(id, username, profession) {
    const { data, error } = await supabase
      .from("viably_users")
      .insert({ user_id: id, username, profession });

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  },

  async setIdea(idea, reddit_talks) {
    const { data: ideaData, error: ideaError } = await supabase
      .from("idea")
      .insert({ idea })
      .select("id")
      .single();

    if (ideaError) {
      return { data: null, error: ideaError };
    }

    const ideaId = ideaData.id;

    const talksToInsert = reddit_talks.map((talk) => ({
      idea_id: ideaId,
      title: talk.title,
      content: talk.content,
      subreddit: talk.subreddit,
      url: talk.url,
      time_ago: talk.timeAgo,
    }));

    const { data: redditData, error: redditError } = await supabase
      .from("reddit_talks")
      .insert(talksToInsert)
      .select("id");

    if (redditError) {
      return { data: null, error: redditError };
    }

    return {
      data: {
        id: ideaId,
        reddit_talks_ids: "ok we are ok",
      },
      error: null,
    };
  },

  async setInsights(_id, insights) {
    const { data, error } = await supabase
      .from("idea")
      .update({ insights })
      .eq("id", _id)
      .select("id")
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  },

  async setPosts(_id, posts, subreddits) {
    const { data, error } = await supabase
      .from("idea")
      .update({ posts, subreddits })
      .eq("id", _id)
      .select("id")
      .single();
    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  },

  async fetchIdea(_id) {
    const { data: idea, error } = await supabase
      .from("idea")
      .select("id, idea, insights, posts, subreddits")
      .eq("id", _id)
      .single();
    if (error) {
      return { idea: null, error };
    }
    return { idea, error: null };
  },

  async fetchIdeaArray(_id) {
    const { data: ideas, error } = await supabase
      .from("idea")
      .select("id, idea, created_at")
      .eq("user_id", _id);

    if (error) {
      return { ideas: null, error };
    }
    return { ideas, error: null };
  },

  async fetchRedditTalks(_id) {
    const { data, error } = await supabase
      .from("reddit_talks")
      .select("*")
      .eq("idea_id", _id);

    if (error) {
      return { data: null, error };
    }
    return { data, error: null };
  },

  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from("viably_users")
      .update(updates)
      .eq("user_id", id);

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  },

  async updateEmail(newEmail) {
    const { user, error } = await supabase.auth.updateUser({
      email: newEmail,
    });

    if (error) {
      return { user: null, error };
    }
    return { user, error: null };
  },

  async updatePassword(newPassword) {
    const { user, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { user: null, error };
    }
    return { user, error: null };
  },

  async sendPasswordResetEmail(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
  },

  async deleteUser(user_id) {
    try {
      const { data, error } = await supabase.functions.invoke("delete-user", {
        body: { user_id },
      });

      if (error) throw error;

      localStorage.clear();
      sessionStorage.clear();

      await supabase.auth.signOut();

      return { data, error: null };
    } catch (err) {
      console.error(err);
      alert("Failed to delete account: " + err.message);
    }
  },
};
