class AuthController < ApplicationController
  skip_before_action :authorized, only: [:index, :create]

  def create
    @user = User.find_by(userName: user_login_params[:userName])
    if @user && @user.authenticate(user_login_params[:password])
      token = encode_token({user_id: @user.id})
      render json: {user: UserSerializer.new(@user), jwt: token}, status: :accepted
    else
      render json: {message: 'Invalid username or password.'}, status: :unauthorized
    end
  end

  def profile
    current_user
    if @user
      render json: {user: UserSerializer.new(@user), jwt: token}, status: :accepted
    else
      render json: {message: 'Invalid username or password.'}, status: :unauthorized
    end
  end


  private

  def user_login_params
    params.require(:user).permit(:userName, :password)
  end

end
