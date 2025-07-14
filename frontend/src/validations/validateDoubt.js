const validateDoubt = (doubt) => {
  const { title, description, questionURL, discussionURL, topic } = doubt;

  const error = {};
  // title validation
  if (!title) {
    error.title = "Title cannot be empty";
  } else if (title.length > 100) {
    error.title = "Title cannot be more than 100 characters long";
  }

  //description validation
  if (!description) {
    error.description = "Description cannot be empty";
  } else if (description.length > 500) {
    error.description = "Description cannot be more than 500 characters long";
  }

  //question URL validation
  if (!questionURL) {
    error.questionURL = "Question URL cannot be empty";
  } else if (
    !/^https?:\/\/(www\.)?learning\.ccbp\.in(?:\/.*)?$/.test(questionURL)
  ) {
    error.questionURL = "Invalid URL";
  }

  //discussion URL validation
  if (!discussionURL) {
    error.discussionURL = "Discussion URL cannot be empty";
  } else if (
    !/^https?:\/\/(www\.)?learning\.ccbp\.in(?:\/.*)?$/.test(discussionURL)
  ) {
    error.discussionURL = "Invalid URL";
  }

  //topic validation
  if (!topic) {
    error.topic = "A topic must be selected";
  }

  return error;
};

export default validateDoubt;
