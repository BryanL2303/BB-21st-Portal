Rails.application.routes.draw do
  root "pages#index"

  namespace :api do
    resources :account do 
      member do
        post '/create_account' => 'account#createAccount'
        post '/authenticate_account' => 'account#authenticateAccount'
        post '/get_account' => 'account#getAccount'
        post '/get_accounts' => 'account#getAccounts'
        post '/get_own_account' => 'account#getOwnAccount'
        post '/get_accounts_by_ids' => 'account#getAccountsByIds'
        post '/toggle_type' => 'account#toggleType'
        post '/edit_account' => 'account#editAccount'
        post '/delete_account' => 'account#deleteAccount'
        post '/get_assignments' => 'account#getAssignments'
        post '/get_account_information' => 'account#getAccountInformation'
      end
    end

    resources :award do
      member do
        post '/create_award' => 'award#createAward'
        post '/get_award' => 'award#getAward'
        post '/edit_award' => 'award#editAward'
        post '/get_awards' => 'award#getAwards'
        post '/get_masteries' => 'award#getMasteries'
        post '/get_quizzes' => 'award#getQuizzes'
        post '/get_questions' => 'award#getQuestions'
        post '/get_columns' => 'award#getColumns'
        post '/delete_award' => 'award#deleteAward'
      end
    end

    resources :mastery do
      member do
        post '/get_columns' => 'mastery#getColumns'
      end
    end

    resources :quiz do
      member do
        post '/create_quiz' => 'quiz#createQuiz'
        post '/get_quiz' => 'quiz#getQuiz'
        post '/get_quizzes' => 'quiz#getQuizzes'
        post '/get_questions' => 'quiz#getQuestions'
        post '/submit_quiz' => 'quiz#submitQuiz'
        post '/delete_quiz' => 'quiz#deleteQuiz'
      end
    end

    resources :question do
      member do
        post '/create_question' => 'question#createQuestion'
        post '/get_question' => 'question#getQuestion'
        post '/get_questions' => 'question#getQuestions'
        post '/get_options' => 'question#getOptions'
        post '/get_rubric' => 'question#getRubric'
        post '/edit_question' => 'question#editQuestion'
        post '/set_permanent' => 'question#setPermanent'
        post '/delete_question' => 'question#deleteQuestion'
      end
    end

    resources :question_option do
      member do
        post '/create_option' => 'question_option#createOption'
        post '/edit_option' => 'question_option#editOption'
        post '/delete_option' => 'question_option#deleteOption'
      end
    end

    resources :answer_rubric do 
      member do
        post '/create_rubric' => 'answer_rubric#createRubric'
        post '/edit_rubric' => 'answer_rubric#editRubric'
        post '/delete_rubric' => 'answer_rubric#deleteRubric'
      end
    end

    resources :quiz_question do 
      member do
      end
    end

    resources :assignment do 
      member do
        post '/create_assignment' => 'assignment#createAssignment'
        post '/get_assignment' => 'assignment#getAssignment'
        post '/get_assignments' => 'assignment#getAssignments'
        post '/submit_assignment' => 'assignment#submitAssignment'
        post '/grade_question' => 'assignment#gradeQuestion'
        post '/get_results_information' => 'assignment#getResultsInformation'
        post '/delete_assignment' => 'assignment#deleteAssignment'
      end
    end

    resources :assigned_account do 
      member do
        post '/create_assigned_account' => 'assigned_account#createAssignedAccount'
        post '/get_assigned_account' => 'assigned_account#getAssignedAccount'
        post '/get_assigned_accounts' => 'assigned_account#getAssignedAccounts'
        post '/get_assignment_answers' => 'assigned_account#getAssignmentAnswers'
        post '/update_assigned_account' => 'assigned_account#updateAssignedAccount'
        post '/set_graded' => 'assigned_account#setGraded'
        post '/delete_assigned_account' => 'assigned_account#deleteAssignedAccount'
      end
    end
  end

  get '*path', to: 'pages#index', via: :all
end
