import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { cloneDeep } from 'lodash-es'
import { User } from 'src/app/models/user.model'
import { UserService } from 'src/app/services/user.service'

@Component({
    selector: 'edit-profile-modal',
    templateUrl: './edit-profile-modal.component.html',
    styleUrls: ['./edit-profile-modal.component.scss'],
    host: {
        class: 'page-cmp-layout',
    },
})
export class EditProfileModalComponent implements OnInit {
    constructor(private userService: UserService) {}

    @Input() userFromDB!: User
    @Output() onBack = new EventEmitter()
    @Output() onSubmitUserEdit = new EventEmitter()

    userFromDBToEdit!: User
    isImgUrlChanged = false

    ngOnInit(): void {
        this.userFromDBToEdit = cloneDeep(this.userFromDB)
    }

    submitUserEdit() {
        this.onSubmitUserEdit.emit(this.userFromDBToEdit)
    }

    async onUploadUserPicture() {
        try {
            const imgUrl = await this.userService.uploadMedia()
            imgUrl ? (this.userFromDBToEdit.imgUrl = imgUrl) : ''
            this.isImgUrlChanged = true
        } catch (err: any) {
            console.error(err)
        }
    }
}
