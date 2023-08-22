# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 202308200000001) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "accounts", force: :cascade do |t|
    t.string "password"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "account_name"
    t.string "account_type"
    t.integer "level"
    t.string "rank"
    t.string "credentials"
  end

  create_table "answer_rubrics", force: :cascade do |t|
    t.bigint "question_id"
    t.string "rubric"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["question_id"], name: "index_answer_rubrics_on_question_id"
  end

  create_table "assigned_accounts", force: :cascade do |t|
    t.bigint "account_id"
    t.bigint "assignment_id"
    t.integer "attempts"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "score"
    t.index ["account_id"], name: "index_assigned_accounts_on_account_id"
    t.index ["assignment_id"], name: "index_assigned_accounts_on_assignment_id"
  end

  create_table "assignment_answers", force: :cascade do |t|
    t.bigint "account_id"
    t.bigint "assignment_id"
    t.bigint "question_id"
    t.bigint "question_option_id"
    t.string "question_type"
    t.string "answer"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "attempt"
    t.float "score"
    t.string "comments"
    t.index ["account_id"], name: "index_assignment_answers_on_account_id"
    t.index ["assignment_id"], name: "index_assignment_answers_on_assignment_id"
    t.index ["question_id"], name: "index_assignment_answers_on_question_id"
    t.index ["question_option_id"], name: "index_assignment_answers_on_question_option_id"
  end

  create_table "assignments", force: :cascade do |t|
    t.bigint "account_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "quiz_id"
    t.boolean "show_answer"
    t.integer "attempt_limit"
    t.bigint "award_id"
    t.bigint "mastery_id"
    t.string "assignment_name"
    t.index ["account_id"], name: "index_assignments_on_account_id"
    t.index ["award_id"], name: "index_assignments_on_award_id"
    t.index ["mastery_id"], name: "index_assignments_on_mastery_id"
    t.index ["quiz_id"], name: "index_assignments_on_quiz_id"
  end

  create_table "attempt_scores", force: :cascade do |t|
    t.bigint "assigned_account_id"
    t.float "score"
    t.integer "attempt"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "graded"
    t.index ["assigned_account_id"], name: "index_attempt_scores_on_assigned_account_id"
  end

  create_table "awards", force: :cascade do |t|
    t.string "badge_name"
    t.string "badge_requirements"
    t.string "results_description"
    t.string "recommended_level"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "has_mastery"
    t.boolean "custom_description"
    t.string "description_cue"
    t.boolean "has_results"
    t.boolean "has_pass"
    t.boolean "has_custom_columns"
  end

  create_table "component_fields", force: :cascade do |t|
    t.bigint "uniform_component_id"
    t.string "description"
    t.integer "score"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["uniform_component_id"], name: "index_component_fields_on_uniform_component_id"
  end

  create_table "custom_columns", force: :cascade do |t|
    t.string "column_title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "award_id"
    t.bigint "mastery_id"
    t.index ["award_id"], name: "index_custom_columns_on_award_id"
    t.index ["mastery_id"], name: "index_custom_columns_on_mastery_id"
  end

  create_table "masteries", force: :cascade do |t|
    t.string "mastery_name"
    t.string "results_description"
    t.string "recommended_level"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "award_id"
    t.string "mastery_requirements"
    t.boolean "custom_description"
    t.string "description_cue"
    t.boolean "has_results"
    t.boolean "has_pass"
    t.boolean "has_custom_columns"
    t.index ["award_id"], name: "index_masteries_on_award_id"
  end

  create_table "question_options", force: :cascade do |t|
    t.bigint "question_id"
    t.string "answer"
    t.boolean "correct"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["question_id"], name: "index_question_options_on_question_id"
  end

  create_table "questions", force: :cascade do |t|
    t.string "question"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "question_type"
    t.boolean "permanent"
    t.bigint "award_id"
    t.bigint "mastery_id"
    t.float "marks"
    t.boolean "assigned"
    t.index ["award_id"], name: "index_questions_on_award_id"
    t.index ["mastery_id"], name: "index_questions_on_mastery_id"
  end

  create_table "quiz_questions", force: :cascade do |t|
    t.bigint "quiz_id"
    t.bigint "question_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["question_id"], name: "index_quiz_questions_on_question_id"
    t.index ["quiz_id"], name: "index_quiz_questions_on_quiz_id"
  end

  create_table "quizzes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "quiz_name"
    t.boolean "assigned"
    t.bigint "award_id"
    t.bigint "mastery_id"
    t.float "marks"
    t.index ["award_id"], name: "index_quizzes_on_award_id"
    t.index ["mastery_id"], name: "index_quizzes_on_mastery_id"
  end

  create_table "selected_components", force: :cascade do |t|
    t.bigint "uniform_inspection_id"
    t.bigint "component_field_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["component_field_id"], name: "index_selected_components_on_component_field_id"
    t.index ["uniform_inspection_id"], name: "index_selected_components_on_uniform_inspection_id"
  end

  create_table "uniform_components", force: :cascade do |t|
    t.string "component_name"
    t.integer "total_score"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "uniform_inspections", force: :cascade do |t|
    t.bigint "account_id"
    t.integer "total_score"
    t.string "date"
    t.integer "assessor_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_uniform_inspections_on_account_id"
  end

end
