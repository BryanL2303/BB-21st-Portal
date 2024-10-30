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
        post '/get_tables' => 'demo_admin#tables'
        post '/get_table_names' => 'demo_admin#table_names'
        post '/get_table' => 'demo_admin#table'
        post '/add_data' => 'demo_admin#add_data'
        post '/update_data' => 'demo_admin#update_data'
        post '/delete_data' => 'demo_admin#delete_data'
      end
    end

    resources :account do
      member do
        post '/create_account' => 'demo_account#create_account'
        post '/authenticate_account' => 'demo_account#authenticate_account'
        post '/get_account' => 'demo_account#account'
        post '/get_accounts_by_type' => 'demo_account#accounts_by_type'
        post '/get_own_account' => 'demo_account#own_account'
        post '/get_accounts_by_ids' => 'demo_account#accounts_by_ids'
        post '/toggle_type' => 'demo_account#toggle_type'
        post '/edit_account' => 'demo_account#edit_account'
        post '/delete_account' => 'demo_account#delete_account'
        post '/get_assignments' => 'demo_account#assignments'
        post '/get_account_information' => 'demo_account#account_information'
      end
    end

    resources :award do
      member do
        post '/create_award' => 'demo_award#create_award'
        post '/get_award' => 'demo_award#award'
        post '/edit_award' => 'demo_award#edit_award'
        post '/get_awards' => 'demo_award#awards'
        post '/get_masteries' => 'demo_award#masteries'
        post '/get_columns' => 'demo_award#columns'
        post '/delete_award' => 'demo_award#delete_award'
      end
    end

    resources :award_tracker do
      member do
        post '/get_attainments' => 'demo_award_tracker#attainments'
        post '/process_changes' => 'demo_award_tracker#process_changes'
      end
    end

    resources :mastery do
      member do
        post '/get_columns' => 'demo_mastery#columns'
      end
    end

    resources :quiz do
      member do
        post '/create_quiz' => 'demo_quiz#create_quiz'
        post '/get_quiz' => 'demo_quiz#quiz'
        post '/get_quizzes' => 'demo_quiz#quizzes'
        post '/get_questions' => 'demo_quiz#questions'
        post '/submit_quiz' => 'demo_quiz#submit_quiz'
        post '/delete_quiz' => 'demo_quiz#delete_quiz'
      end
    end

    resources :question do
      member do
        post '/create_question' => 'demo_question#create_question'
        post '/get_question' => 'demo_question#question'
        post '/get_questions' => 'demo_question#questions'
        post '/get_options' => 'demo_question#options'
        post '/get_rubric' => 'demo_question#rubric'
        post '/edit_question' => 'demo_question#edit_question'
        post '/set_permanent' => 'demo_question#set_permanent'
        post '/delete_question' => 'demo_question#delete_question'
      end
    end

    resources :question_option do
      member do
        post '/create_option' => 'demo_question_option#create_option'
        post '/edit_option' => 'demo_question_option#edit_option'
        post '/delete_option' => 'demo_question_option#delete_option'
      end
    end

    resources :answer_rubric do
      member do
        post '/create_rubric' => 'demo_answer_rubric#create_rubric'
        post '/edit_rubric' => 'demo_answer_rubric#edit_rubric'
        post '/delete_rubric' => 'demo_answer_rubric#delete_rubric'
      end
    end

    resources :quiz_question do
      member do
      end
    end

    resources :assignment do
      member do
        post '/create_assignment' => 'demo_assignment#create_assignment'
        post '/get_assignment' => 'demo_assignment#assignment'
        post '/get_assignments' => 'demo_assignment#assignments'
        post '/submit_assignment' => 'demo_assignment#submit_assignment'
        post '/grade_question' => 'demo_assignment#grade_question'
        post '/get_results_information' => 'demo_assignment#results_information'
        post '/delete_assignment' => 'demo_assignment#delete_assignment'
      end
    end

    resources :assigned_account do
      member do
        post '/create_assigned_account' => 'demo_assigned_account#create_assigned_account'
        post '/get_assigned_account' => 'demo_assigned_account#assigned_account'
        post '/get_assigned_accounts' => 'demo_assigned_account#assigned_accounts'
        post '/get_assignment_answers' => 'demo_assigned_account#assignment_answers'
        post '/update_assigned_account' => 'demo_assigned_account#update_assigned_account'
        post '/set_graded' => 'demo_assigned_account#set_graded'
        post '/delete_assigned_account' => 'demo_assigned_account#delete_assigned_account'
      end
    end

    resources :uniform_inspection do
      member do
        post '/create_uniform_inspection' => 'demo_uniform_inspection#create_uniform_inspection'
        post '/get_inspection' => 'demo_uniform_inspection#inspection'
        post '/get_inspections' => 'demo_uniform_inspection#inspections_summary'
        post '/get_component_fields' => 'demo_uniform_inspection#component_fields'
        post '/delete_uniform_inspection' => 'demo_uniform_inspection#delete_uniform_inspection'
      end
    end
  end

  get '*path', to: 'pages#index', via: :all
end
