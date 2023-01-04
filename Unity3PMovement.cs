using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Cinemachine;

public class PlayerMovement : MonoBehaviour
{
    public CharacterController controller;
    public Transform groundCheck;

    public Transform cam;
    public CinemachineFreeLook freecam;
    
    public float groundDistance = 0.6f;
    public LayerMask groundMask;

    public float speed = 6f;
    public float jumpHeight = 3f;
    public float gravity = -9.81f;
    public float turnSmoothTime = 0.1f;

    public float zoomSpeed = 1f;
    public float zoomSmoothTime = 0.1f;
    public float zoomInnerRange = 5f;
    public float zoomOuterRange = 15f;

    float turnSmoothVelocity;
    float zoomSmoothVelocity;
    float targetZoom;
    bool isGrounded;
    Vector3 velocity;

    // Start is called before the first frame update
    void Start()
    {
        Cursor.lockState = CursorLockMode.Locked;
    }
    // Update is called once per frame
    void Update()
    {
        isGrounded = Physics.CheckSphere(groundCheck.position, groundDistance, groundMask);
        if (isGrounded && velocity.y < 0) {
            velocity.y = -2f;
        }
        float horizontal = Input.GetAxisRaw("Horizontal");
        float vertical = Input.GetAxisRaw("Vertical");
        Vector3 direction = new Vector3(horizontal, 0f, vertical).normalized;

        velocity.y += gravity * Time.deltaTime;
        controller.Move(velocity * Time.deltaTime);

        if (direction.magnitude >= 0.1f) {
            float targetAngle = Mathf.Atan2(direction.x, direction.z) * Mathf.Rad2Deg + cam.eulerAngles.y;
            float angle = Mathf.SmoothDampAngle(transform.eulerAngles.y, targetAngle, ref turnSmoothVelocity, turnSmoothTime);
            transform.rotation = Quaternion.Euler(0f, angle, 0f);

            Vector3 moveDir = Quaternion.Euler(0f, targetAngle, 0f) * Vector3.forward;
            controller.Move(moveDir.normalized * speed * Time.deltaTime);
        }

        if (Input.GetButtonDown("Jump") && isGrounded) {
            velocity.y = Mathf.Sqrt(jumpHeight * -2 * gravity);
        }

        float scroll = Input.GetAxis("Mouse ScrollWheel");
        // Smooth zoom - not working
        // targetZoom = freecam.m_Orbits[1].m_Radius - scroll * zoomSpeed;
        // float zoom = Mathf.SmoothDamp(freecam.m_Orbits[1].m_Radius, targetZoom, ref zoomSmoothVelocity, zoomSmoothTime);
        if (scroll != 0)
        {
            freecam.m_Orbits[0].m_Height = Mathf.Clamp(freecam.m_Orbits[0].m_Height - scroll * zoomSpeed, zoomInnerRange, zoomOuterRange);
            freecam.m_Orbits[1].m_Radius = Mathf.Clamp(freecam.m_Orbits[1].m_Radius - scroll * zoomSpeed, zoomInnerRange, zoomOuterRange);
            freecam.m_Orbits[2].m_Height = Mathf.Clamp(freecam.m_Orbits[2].m_Height + scroll * zoomSpeed, zoomOuterRange * -1f, zoomInnerRange * -1f);
        }
    }
}
