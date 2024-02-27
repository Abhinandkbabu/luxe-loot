// --------------update Name----------------------
$(document).ready(function() {
    $('.edit-button').click(function() {
        $('#inputName').prop('disabled', false);
        $(this).hide();
        $('.save-button').show();
    });

    $('.save-button').click(function() {
        var newName = $('#inputName').val();

        // AJAX request to update the name
        $.ajax({
            url: '/userUpdateName', // Specify your backend endpoint for updating the name
            method: 'POST',
            data: { newName: newName },
            success: function(response) {
                alert('Name updated successfully!');
                $('.edit-button').show();
                $('.save-button').hide();
                $('#inputName').prop('disabled', true);

                // Update the name in the side panel
                $('.profile-usertitle-name').text(newName);
            },
            error: function(xhr, status, error) {
                console.error('Error updating name:', error);
                alert('Error updating name. Please try again.');
            }
        });
    });
});

// --------------update Name end----------------------

//----------------reseet Password------------------------
function validateExistingPassword() {
  var passwordInput = document.getElementById('password');
  var passwordError = document.getElementById('error');
  if (passwordInput.value.trim().length < 8 || /\s/.test(passwordInput.value)) {
      passwordError.innerText = 'Password must be at least 8 characters';
  } else {
      passwordError.innerText = '';
  }
}
function validatePassword() {
  var passwordInput = document.getElementById('new-password');
  var passwordError = document.getElementById('error');
  if (passwordInput.value.trim().length < 8 || /\s/.test(passwordInput.value)) {
      passwordError.innerText = 'Password must be at least 8 characters';
  } else {
      passwordError.innerText = '';
  }
}

function validateRepeatPassword() {
  var repeatPasswordInput = document.getElementById('repeat-password');
  var passwordInput = document.getElementById('new-password');
  var repeatPasswordError = document.getElementById('error');
  if (repeatPasswordInput.value.trim() !== passwordInput.value.trim()) {
      repeatPasswordError.innerText = 'Passwords do not match';
  } else {
      repeatPasswordError.innerText = '';
  }
}

$('.update-password').click(function() {
  var password = $('#password').val();
  var newPassword = $('#new-password').val();
  var repeatPassword = $('#repeat-password').val();

  // Validate passwords
  if (password === '' || newPassword === '' || repeatPassword === '') {
      alert('Please fill in all fields.');
      return;
  }

  if (newPassword !== repeatPassword) {
      alert('New password and confirm password do not match.');
      return;
  }

  // AJAX request to update the password
  $.ajax({
      url: '/userUpdatePassword', // Specify your backend endpoint for updating the password
      method: 'POST',
      data: {
          password: password,
          newPassword: newPassword
      },
      success: function(response) {
          alert('Password updated successfully!');
          $('#password').val('');
          $('#new-password').val('');
          $('#repeat-password').val('');
      },
      error: function(xhr, status, error) {
          console.error('Error updating password:', error);
          alert('Error updating password. Please try again.');
      }
  });
});

