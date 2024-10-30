# frozen_string_literal: true

module Api
  # The AdminController is responsible for providing functions for the administrator
  # within the API, such as CRUD functions for all tables in the schema.
  #
  # This controller should include functions used specifically only by the administrator
  # to help with managing the database
  class DemoAdminController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request

    def table_names
      table_names = ActiveRecord::Base.connection.tables
      table_names.delete('schema_migrations')
      table_names.delete('ar_internal_metadata')
      render json: table_names, status: :ok
    end

    def table
      data = ActiveRecord::Base.connection.exec_query("SELECT * FROM #{params[:table_name]} ORDER BY id ASC")
      columns = ActiveRecord::Base.connection.columns(params[:table_name])
      render json: { data:, columns: }, status: :ok
    end

    def add_data
      model_class = params[:table_name].classify.safe_constantize

      if model_class
        new_entry = model_class.new
        params[:columns].each do |column|
          new_entry[column] = params[:data][column] if new_entry.respond_to?(column)
        end
        new_entry.save
      end

      data = ActiveRecord::Base.connection.exec_query("SELECT * FROM #{model_class.table_name} ORDER BY id ASC")
      columns = ActiveRecord::Base.connection.columns(model_class.table_name)

      render json: { data:, columns: }, status: :created
    end

    def update_data
      data = ActiveRecord::Base.connection.exec_query("SELECT * FROM #{params[:table_name]} WHERE id = #{params[:id]}")
                               .first
      if data.any?
        params[:columns].each do |column|
          data[column] = params[:data][column] if params[:data][column].present?
        end

        set_clause = data.map do |key, value|
          "#{key} = #{ActiveRecord::Base.connection.quote(value)}"
        end.join(', ')
        update_query = "UPDATE #{ActiveRecord::Base.connection.quote_table_name(params[:table_name])} SET #{set_clause}
                        WHERE id = #{ActiveRecord::Base.connection.quote(params[:id])}"
        ActiveRecord::Base.connection.execute(update_query)
      end

      data = ActiveRecord::Base.connection.exec_query("SELECT * FROM #{params[:table_name]} ORDER BY id ASC")
      columns = ActiveRecord::Base.connection.columns(params[:table_name])
      render json: { data:, columns: }, status: :accepted
    end

    def delete_data
      data = ActiveRecord::Base.connection.exec_query("SELECT * FROM #{params[:table_name]} WHERE id = #{params[:id]}")
                               .first

      ActiveRecord::Base.connection.execute("DELETE FROM #{params[:table_name]} WHERE id = #{params[:id]}") if data.any?

      data = ActiveRecord::Base.connection.exec_query("SELECT * FROM #{params[:table_name]} ORDER BY id ASC")
      columns = ActiveRecord::Base.connection.columns(params[:table_name])
      render json: { data:, columns: }, status: :ok
    end

    def tables
      tables = {}
      columns = {}
      table_names = ActiveRecord::Base.connection.tables
      table_names.each do |table_name|
        next if %w[schema_migrations ar_internal_metadata].include?(table_name)

        tables[table_name] = ActiveRecord::Base.connection.exec_query("SELECT * FROM #{table_name}")
        columns[table_name] = ActiveRecord::Base.connection.columns(table_name)
      end

      table_names.delete('schema_migrations')
      table_names.delete('ar_internal_metadata')

      render json: { table_names:, tables:, columns: }, status: :ok
    end
  end
end
