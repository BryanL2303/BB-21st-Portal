# frozen_string_literal: true

Rails.application.routes.draw do
  root 'pages#index'

  resources :application do
    member do
      post '/check_session' => 'application#check_session'
      post '/log_out' => 'application#log_out'
    end
  end

  namespace :api do
    resources :admin do
      member do
        post '/get_tables' => 'admin#tables'
        post '/get_table_names' => 'admin#table_names'
        post '/get_table' => 'admin#table'
        post '/add_data' => 'admin#add_data'
        post '/update_data' => 'admin#update_data'
        post '/delete_data' => 'admin#delete_data'
      end
    end

    resources :account do
      member do
        post '/create_account' => 'account#create_account'
        post '/authenticate_account' => 'account#authenticate_account'
        post '/get_account' => 'account#account'
        post '/get_accounts_by_type' => 'account#accounts_by_type'
        post '/get_own_account' => 'account#own_account'
        post '/get_accounts_by_ids' => 'account#accounts_by_ids'
        post '/toggle_type' => 'account#toggle_type'
        post '/edit_account' => 'account#edit_account'
        post '/delete_account' => 'account#delete_account'
        post '/get_assignments' => 'account#assignments'
        post '/get_account_information' => 'account#account_information'
      end
    end

    resources :award do
      member do
        post '/create_award' => 'award#create_award'
        post '/get_award' => 'award#award'
        post '/edit_award' => 'award#edit_award'
        post '/get_awards' => 'award#awards'
        post '/get_masteries' => 'award#masteries'
        post '/get_columns' => 'award#columns'
        post '/delete_award' => 'award#delete_award'
      end
    end

    resources :award_tracker do
      member do
        post '/get_attainments' => 'award_tracker#attainments'
        post '/process_changes' => 'award_tracker#process_changes'
      end
    end

    resources :mastery do
      member do
        post '/get_columns' => 'mastery#columns'
      end
    end

    resources :quiz do
      member do
        post '/create_quiz' => 'quiz#create_quiz'
        post '/get_quiz' => 'quiz#quiz'
        post '/get_quizzes' => 'quiz#quizzes'
        post '/get_questions' => 'quiz#questions'
        post '/submit_quiz' => 'quiz#submit_quiz'
        post '/delete_quiz' => 'quiz#delete_quiz'
      end
    end

    resources :question do
      member do
        post '/create_question' => 'question#create_question'
        post '/get_question' => 'question#question'
        post '/get_questions' => 'question#questions'
        post '/get_options' => 'question#options'
        post '/get_rubric' => 'question#rubric'
        post '/edit_question' => 'question#edit_question'
        post '/set_permanent' => 'question#set_permanent'
        post '/delete_question' => 'question#delete_question'
      end
    end

    resources :question_option do
      member do
        post '/create_option' => 'question_option#create_option'
        post '/edit_option' => 'question_option#edit_option'
        post '/delete_option' => 'question_option#delete_option'
      end
    end

    resources :answer_rubric do
      member do
        post '/create_rubric' => 'answer_rubric#create_rubric'
        post '/edit_rubric' => 'answer_rubric#edit_rubric'
        post '/delete_rubric' => 'answer_rubric#delete_rubric'
      end
    end

    resources :quiz_question do
      member do
      end
    end

    resources :assignment do
      member do
        post '/create_assignment' => 'assignment#create_assignment'
        post '/get_assignment' => 'assignment#assignment'
        post '/get_assignments' => 'assignment#assignments'
        post '/submit_assignment' => 'assignment#submit_assignment'
        post '/grade_question' => 'assignment#grade_question'
        post '/get_results_information' => 'assignment#results_information'
        post '/delete_assignment' => 'assignment#delete_assignment'
      end
    end

    resources :assigned_account do
      member do
        post '/create_assigned_account' => 'assigned_account#create_assigned_account'
        post '/get_assigned_account' => 'assigned_account#assigned_account'
        post '/get_assigned_accounts' => 'assigned_account#assigned_accounts'
        post '/get_assignment_answers' => 'assigned_account#assignment_answers'
        post '/update_assigned_account' => 'assigned_account#update_assigned_account'
        post '/set_graded' => 'assigned_account#set_graded'
        post '/delete_assigned_account' => 'assigned_account#delete_assigned_account'
      end
    end

    resources :uniform_inspection do
      member do
        post '/create_uniform_inspection' => 'uniform_inspection#create_uniform_inspection'
        post '/get_inspection' => 'uniform_inspection#inspection'
        post '/get_inspections' => 'uniform_inspection#inspections_summary'
        post '/get_component_fields' => 'uniform_inspection#component_fields'
        post '/delete_uniform_inspection' => 'uniform_inspection#delete_uniform_inspection'
      end
    end
  end

  get '*path', to: 'pages#index', via: :all
end
